import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  uiService: Ember.inject.service('ui-service'),

  aircraftFormCtrl: Ember.inject.controller('main.aircraft.aircraft-form'),
  aircraftAmenitiesCtrl: Ember.inject.controller('main.aircraft.amenities'),
  aircraftImagesCtrl: Ember.inject.controller('main.aircraft.images'),
  aircraftSpecialPriceCtrl: Ember.inject.controller('main.aircraft.special-price'),
  aircraftAvailabilityCtrl: Ember.inject.controller('main.aircraft.availability'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    this.retrieveAircraft();
    paging.addObserver('current', this, this.retrieveAircraft);
  },

  retrieveAircraft() {

    let paging = this.get('paging');

    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let filter = this.get('filter');
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),

      code: filter.code,
      model: filter.model,
      yearOfMake: filter.yearOfMake,
      maxPassengers: filter.maxPassengers,
      status: filter.status
      //operatorId: null,
      //airportId: null
    };

    let url = 'aircraft';
    let that = this;
    this.get('requestSender').ajaxGet(url, JsonUtil.cleanEmptyProperty(param), header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        //json = that.get('dataStub').getAircrafts();
        let data = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('data', data);
      }, function (reason) {
      });
  },

  doDelete(aircraft) {
    if (!this.get('uiService').confirm('Delete aircraft ?')) {
      return;
    }

    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let that = this;
    let url = 'aircraft/' + aircraft.id;
    this.get('requestSender').ajaxDelete(url, null, header)
      .then(function (json) {
        that.retrieveAircraft();
      }, function (reason) {
        that.get('uiService').showMessage('Delete aircraft failed. [' + reason.xhr.responseText + ']')
      });
  },

  actions: {
    refresh() {
      this.retrieveAircraft();
    },

    toggleFilter() {
      this.toggleProperty('shownFilter');
    },

    applyFilter(filter) {
      this.set('filter', filter);
      let current = this.get('paging').get('current');
      if (current != 1) {
        this.get('paging').set('current', 1); // requery data
      } else {
        this.retrieveAircraft();
      }
    },

    addAircraft() {
      this.get('aircraftFormCtrl').reset();
      this.transitionToRoute('main.aircraft.aircraft-form');
    },

    editAircraft(aircraft) {
      this.get('aircraftFormCtrl').edit(aircraft);
      this.transitionToRoute('main.aircraft.aircraft-form');
    },

    deleteAircraft(aircraft) {
      this.doDelete(aircraft);

    },

    setupAmenities(aircraft) {
      this.get('aircraftAmenitiesCtrl').set('aircraft', aircraft);
      this.transitionToRoute('main.aircraft.amenities');
    },

    setupImages(aircraft) {
      this.get('aircraftImagesCtrl').set('aircraft', aircraft);
      this.transitionToRoute('main.aircraft.images');
    },

    setupAvailability(aircraft) {
      this.get('aircraftAvailabilityCtrl').set('aircraft', aircraft);
      this.transitionToRoute('main.aircraft.availability');
    },

    setupSpecialPrice(aircraft) {
      this.get('aircraftSpecialPriceCtrl').set('aircraft', aircraft);
      this.transitionToRoute('main.aircraft.special-price');
    }
  }
});
