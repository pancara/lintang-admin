import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  aircraft: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
  },

  reset() {
    this.set('aircraft', null);

    this.set('error', false);
    this.set('success', false);
  },

  edit(aircraft) {
    this.reset();
    this.set('aircraft', aircraft);

    this.set('operator', aircraft.operator);
    this.set('model', aircraft.model);
    this.set('registrationNumber', aircraft.registrationNumber);
    this.set('aircraftType', aircraft.aircraftType);
    this.set('safetyRating', aircraft.safetyRating);
    this.set('description', aircraft.description);
    this.set('yearOfMake', aircraft.yearOfMake);
    this.set('maxPassengers', aircraft.maxPassengers);
    this.set('speedKts', aircraft.speedKts);
    this.set('speedKmh', aircraft.Kmh);
    this.set('maxRangeKm', aircraft.maxRangeKm);
    this.set('maxRangeNm', aircraft.maxRangeNm);
    this.set('basePrice', aircraft.basePrice);
    this.set('marginPrice', aircraft.marginPrice);
    this.set('status', aircraft.status);
    this.set('airport', aircraft.base);
  },

  populateAmenities() {
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
    this.get('request-sender').ajaxGet('config/amenities', param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let amenitiesList = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('amenitiesList', amenitiesList);
      }, function (reason) {
      });
  },

  actions: {

    hideAmenityList() {
      this.set('selectingAmenity', false);
    },

    showAmenityList() {
      this.set('selectingAmenity', true);
      let that = this;

      Ember.run.later(this, function () {
        let paging = that.get('paging');
        if (paging != null) {
          paging.addObserver('current', that, that.populateAmenities);
        }
        that.populateAmenities();
      });
    },

    deleteAmenity(amenity) {
      if (!this.get('uiService').confirm('Remove amenity ?')) {
        return;
      }

      let aircraft = this.get('aircraft');

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let url = 'aircraft/amenities/' + aircraft.id + '/' + amenity.id;

      let that = this;
      this.get('requestSender').ajaxDelete(url, null, header)
        .then(function (json) {
          Ember.set(aircraft, 'amenities', ArrayUtil.removeObject(aircraft.amenities, amenity))
        }, function (reason) {
          that.get('uiService').showMessage('Delete amenity failed. [' + reason.xhr.responseText + ']')
        });
    },

    addAmenity(amenity) {
      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let aircraft = this.get('aircraft');
      let url = 'aircraft/amenities/' + aircraft.id;

      let param = {
        "amenitiesId": [
          amenity.id
        ]
      };

      let that = this;
      this.get('requestSender').ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.get('aircraft').amenities.pushObject(amenity);
          that.get('uiService').showMessage('Amenity added');
        }, function (reason) {
          that.get('uiService').showMessage('Add amenitiy failed. [' + reason.xhr.responseText + ']')
        });
    },

    refresh() {
      this.populateAmenities();
    }
  }
});
