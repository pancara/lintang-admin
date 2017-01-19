import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';


export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  config: null,
  airport: null,
  airportId: null,
  amount: null,
  keyword: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  searchMode: false,
  newEntry: false,

  afterRender() {
    this.addObserver('paging.current', this, this.retrieveAirport);
  },

  init() {
    let that = this;
    this.addObserver('config', this, function () {
      let config = that.get('config');
      if (config != null) {
        that.set('amount', config.amount);
        that.set('airportId', config.airport.id);
      }
    });
  },

  add() {
    this.setProperties({
      airport: null,
      newData: true,
      error: false,
      success: false
    });
  },

  edit(config) {
    this.setProperties({
      error: false,
      success: false,
      airport: config.airport,
      newData: false,
      amount: config.amount
    })
  },

  retrieveAirport() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;

    let keyword = this.get('keyword');

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),
      name: keyword
    };

    let url = 'airport/' + keyword;
    this.get('request-sender').ajaxGet(url, param, header)
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

  searchAirport() {
    if (this.get('paging').get('current') === 1) {
      this.retrieveAirport();
    } else {
      this.get('paging').set('current', 1);
    }
  },

  actions: {
    onKeydown() {
      if (event.keyCode === 13) {
        this.searchAirport();
      }
    },

    doSearch() {
      this.searchAirport();
    },
    showSearch() {
      this.set('searchMode', true);
    },
    hideSearch() {
      this.set('searchMode', false);
    },
    refresh() {
    },

    save() {
      let param = {
        amount: this.get('amount'),
        airport: {
          id: this.get('airport').id
        }
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'config/airportfee/landing';
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Data saved',
            error: false,
            success: true
          };
          that.setProperties(prop);
          Ember.run.later(that, function () {
            that.transitionToRoute('main.config-airport-fee-landing');
          }, 500);

        }, function (reason) {
          let prop = {
            errorMessage: reason.xhr.responseText,
            error: true,
            success: false
          };
          that.setProperties(prop);
        });
    },

    cancel() {
      this.transitionToRoute('main.config-airport-fee-landing');
    },

    selectAirport(airport) {
      this.set('airport', airport);
    }
  }
});
