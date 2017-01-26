import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  uiService: Ember.inject.service('ui-service'),
  formCtrl: Ember.inject.controller('main.config-airport-unavailability.form'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    if (paging != null) {
      paging.addObserver('current', this, this.retrieveConfigs);
      this.retrieveConfigs();
    }

    this.set('aircraftTypes', this.get('datastub').getAircraftTypes());
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
    Ember.$.extend(param, this.get('filter'));

    this.get('request-sender').ajaxGet('config/airportunavailability', param, header)
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

  doDelete(config) {
    if (!this.get('uiService').confirm('Delete config ?')) {
      return;
    }

    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let that = this;
    let url = 'config/airportunavailability/' + config.id;
    this.get('requestSender').ajaxDelete(url, null, header)
      .then(function (json) {
        that.retrieveConfigs();
      }, function (reason) {
        that.get('uiService').showMessage('Delete config failed. [' + reason.xhr.responseText + ']')
      });
  },

  actions: {
    toggleFilter() {
      this.toggleProperty('shownFilter');
    },

    add() {
      this.get('formCtrl').add();
      this.transitionToRoute('main.config-airport-unavailability.form');
    },

    delete(config) {
      this.doDelete(config);
    },

    refresh() {
      this.retrieveConfigs();
    },


    applyFilter(filter) {
      this.set('filter', filter);
      let current = this.get('paging').get('current');
      if (current != 1) {
        this.get('paging').set('current', 1); // requery data
      } else {
        this.retrieveConfigs();
      }
    }

  }
});
