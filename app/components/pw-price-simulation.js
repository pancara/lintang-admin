import Ember from 'ember';
import JsonUtil from '../utils/json-util';

export default Ember.Component.extend({

  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  uiService: Ember.inject.service('ui-service'),

  classNames: ['panel', 'panel-default', 'pw-price-simulation'],
  aircraftType: 'PK-001',
  maxRangeNm: null,
  speedKts: null,
  basePrice: null,
  marginPrice: null,
  selectingOrigin: false,
  selectingDestination: false,

  price: null,
  fullStop: null,
  time: null,

  populateOrigin() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('pagingOrigin');
    let that = this;

    let keyword = this.get('keywordOrigin');
    if (keyword == null || keyword.length === 0) {
      this.get('uiService').showMessage('Keyword required.');
      return;
    }

    if (keyword.length < 3) {
      this.get('uiService').showMessage('Minimal keyword is 3 character.');
      return;
    }

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current')
    };

    let url = 'airport/' + keyword;
    this.get('requestSender').ajaxGet(url, param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let origins = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('origins', origins);
      }, function (reason) {
      });
  },

  populateDestination() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('pagingDestination');
    let that = this;

    let keyword = this.get('keywordDestination');
    if (keyword == null || keyword.length === 0) {
      this.get('uiService').showMessage('Keyword required.');
      return;
    }

    if (keyword.length < 3) {
      this.get('uiService').showMessage('Minimal keyword is 3 character.');
      return;
    }

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current')
    };

    let url = 'airport/' + keyword;
    this.get('requestSender').ajaxGet(url, param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let destinations = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('destinations', destinations);
      }, function (reason) {
      });
  },

  calculatePrice() {
    let maxRangeNm = this.get('maxRangeNm');
    let basePrice = this.get('basePrice');
    let marginPrice = this.get('marginPrice');

    let speedKts = this.get('speedKts');
    let aircraftType = this.get('aircraftType');

    var baseAirport = this.get('baseAirport');

    let specialPrice = this.get('specialPrice');
    if (specialPrice == null || specialPrice.length < 0) {
      specialPrice = 0;
    }

    var origin = this.get('origin');
    var destination = this.get('destination');

    let date = new Date();
    let flightDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);


    if (baseAirport == null) {
      this.get('uiService').showMessage('Base airport is empty');
      return;
    }

    if (origin == null) {
      this.get('uiService').showMessage('Origin is empty');
      return;
    }

    if (destination == null) {
      this.get('uiService').showMessage('Destination is empty');
      return;
    }


    let params = {
      maxRangeNm: maxRangeNm,
      basePrice: basePrice,
      marginPrice: marginPrice,
      speedKts: speedKts,
      aircraftType: aircraftType,
      base: {
        id: baseAirport.id
      },
      percentageOfSpecialPrice: specialPrice,
      legs: [
        {
          legNumber: 1,
          flightDate: flightDate,
          originAirport: {
            id: origin.id
          },
          destinationAirport: {
            id: destination.id
          }
        }
      ]
    };

    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let url = 'charter/simulate';
    var that = this;
    this.get('requestSender').ajaxPost(url, JSON.stringify(params), header)
      .then(function (json) {
        that.set('price', json.price);
        that.set('time', json.time);
        that.set('fuelStop', json.fuelStop);
      }, function (reason) {
        that.get('uiService').showMessage(reason.xhr.responseText)
      });

  },
  actions: {
    startSelectingOrigin() {
      this.set('selectingOrigin', true);
    },
    endSelectingOrigin() {
      this.set('selectingOrigin', false);
    },

    startSelectingDestination() {
      this.set('selectingDestination', true);
    },

    endSelectingDestination() {
      this.set('selectingDestination', false);
    },

    refreshOrigin() {
      this.populateOrigin();
    },

    refreshDestination() {
    },

    doSearchOrigin() {
      this.populateOrigin();
    },

    doSearchDestination() {
      this.populateDestination();
    },

    selectOrigin(airport) {
      this.set('origin', airport);
    },

    selectDestination(airport) {
      this.set('destination', airport);
    },

    simulatePrice() {
      this.calculatePrice();
    }
  }
});
