import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),

  configFormCtrl: Ember.inject.controller('main.config-airport-fee-parking.form'),
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

    this.get('request-sender').ajaxGet('config/airportfee/parking', param, header)
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
    toggleFilter() {
      this.toggleProperty('shownFilter');
    },
    add() {
      this.get('configFormCtrl').add();
      this.transitionToRoute('main.config-airport-fee-parking.form');
    },

    edit(config) {
      this.get('configFormCtrl').edit(config);
      this.transitionToRoute('main.config-airport-fee-parking.form');
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
