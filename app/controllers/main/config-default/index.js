import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  configFormCtrl: Ember.inject.controller('main.config-default.form'),
  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    paging.addObserver('current', this, this.retrieveConfigs);
    this.retrieveConfigs();
  },

  retrieveConfigs() {
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

    this.get('request-sender').ajaxGet('config/default', null, header)
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
      this.retrieveConfigs();
    },

    changeValue(config) {
      this.get('configFormCtrl').set('config', config);
      this.transitionToRoute('main.config-default.form');

      //let prompt = customer.isBlocked ? 'Change status to UNBLOCKED' : 'Change status to BLOCKED';
      //if (!this.get('ui-service').confirm(prompt)) {
      //  return;
      //}
      //
      //let header = {
      //  Authorization: this.get('security-service').getAuthBearer()
      //};
      //
      //let param = {
      //  isBlocked: !customer.isBlocked
      //};
      //
      //let that = this;
      //this.get('request-sender').ajaxPut('customer/' + customer.id, JsonUtil.toJson(param), header)
      //  .then(function (json) {
      //    that.retrieveCustomer();
      //  }, function (reason) {
      //  });
    }
  }
});
