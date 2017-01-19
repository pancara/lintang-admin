import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  uiService: Ember.inject.service('ui-service'),

  formCtrl: Ember.inject.controller('main.voucher.form'),
  data: null,
  shownFilter: false,
  filter: {},


  afterRender() {
    let paging = this.get('paging');
    paging.addObserver('current', this, this.retrieveVouchers);
    this.retrieveVouchers();
  },

  retrieveVouchers() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    paging.set('rowPerPage', 20);
    let that = this;
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current')
    };

    this.get('requestSender').ajaxGet('voucher', null, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let data = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('data', data);
      }, function (reason) {
      });
  },

  actions: {
    refresh() {
      this.retrieveVouchers();
    },

    addVoucher() {
      this.get('formCtrl').add();
      this.transitionToRoute('main.voucher.form');
    },

    editVoucher(voucher) {
      this.get('formCtrl').edit(voucher);
      this.transitionToRoute('main.voucher.form');
    },

    deleteVoucher(voucher) {
      var prompt = 'Delete Voucher ' + voucher.code + ' ?';
      if (this.get('uiService').confirm(prompt)) {

        var header = {
          Authorization: this.get('securityService').getAuthBearer()
        };

        let that = this;
        let url = 'voucher/' + voucher.id;
        this.get('request-sender').ajaxDelete(url, null, header)
          .then(function (json) {
            that.retrieveVouchers();
          }, function (reason) {
            this.get('uiService').showMessage(reason.xhr.errorMessage);
          });
      }
    }
  }
});
