import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  uiService: Ember.inject.service('ui-service'),

  formCtrl: Ember.inject.controller('main.config-pricing.form'),
  data: null,
  shownFilter: false,
  filter: {},


  afterRender() {
    let paging = this.get('paging');
    paging.addObserver('current', this, this.retrievePricings);
    this.retrievePricings();
  },

  retrievePricings() {
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

    this.get('requestSender').ajaxGet('config/pricing', null, header)
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
      this.retrievePricings();
    },

    addPricing() {
      this.get('formCtrl').add();
      this.transitionToRoute('main.config-pricing.form');
    },

    editPricing(pricing) {
      this.get('formCtrl').edit(pricing);
      this.transitionToRoute('main.config-pricing.form');
    },

    deletePricing(pricing) {
      var prompt = 'Delete Pricing ' + pricing.pricingName + ' ?';
      if (this.get('uiService').confirm(prompt)) {

        var header = {
          Authorization: this.get('securityService').getAuthBearer()
        };

        let that = this;
        let url = 'config/pricing/' + pricing.id;
        this.get('request-sender').ajaxDelete(url, null, header)
          .then(function (json) {
            that.retrievePricings();
          }, function (reason) {
            this.get('uiService').showMessage('Delete failed..');
          });
      }
    }
  }
});
