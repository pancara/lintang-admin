import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';

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

  //init() {
  //  this.set('aircraft', {
  //    "model": "Airbus A319",
  //    "registrationNumber": "N-X-211",
  //    "aircraftType": "ULTRA_LONG_RANGE",
  //    "safetyRating": "FAA IASA Category 1",
  //    "description": "The most comfortable way to fly",
  //    "yearOfMake": "2010",
  //    "maxPassengers": "15",
  //    "speedKts": "510",
  //    "speedKmh": "700",
  //    "maxRangeKm": "8000",
  //    "maxRangeNm": "5000",
  //    "basePrice": "500000",
  //    "marginPrice": "100000",
  //    "status": "ACTIVE",
  //    "id": "10",
  //    "code": "PWXONJ12",
  //    "base": {
  //      "id": "1",
  //      "icaoCode": "WIHH",
  //      "iataCode": "CGK",
  //      "name": "Halim Perdana Kusumah",
  //      "description": "Halim Perdana Kusumah",
  //      "point": {
  //        "latitude": "234.00",
  //        "longitude": "14.00"
  //      },
  //      "municipality": "Jakarta",
  //      "region": "Jakarta Raya",
  //      "country": "Indonesia"
  //    },
  //    "operator": {
  //      "name": "Lintang Air",
  //      "description": "Value for money Private Jet Charter service",
  //      "contactName": "Badu Badu PhD.",
  //      "contactPhone": "0888864279",
  //      "contactMail": "trisna@lintang.id",
  //      "id": "21",
  //      "bankInfo": {
  //        "branch": "Cibubur",
  //        "account": "123456780",
  //        "name": "Trisna Wanto",
  //        "bank": {
  //          "id": "50",
  //          "code": "012",
  //          "name": "Bank Mandiri"
  //        }
  //      },
  //      "code": "PWXOMJ21",
  //      "status": "ACTIVE",
  //      "fee": "5.0"
  //    },
  //    "images": [
  //      {
  //        "id": 1,
  //        "url": "aircraft/uwjwlkwo99.jpg",
  //        "description": "Front View",
  //        "isMainImage": "true"
  //      }
  //    ],
  //    "amenities": [
  //      {
  //        "name": "WIFI",
  //        "description": "All in WIFI service",
  //        "status": "ACTIVE",
  //        "id": 1,
  //        "logo": "amenities/ioieu3999"
  //      }
  //    ]
  //  });
  //},

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

      let param = {
        amenitiesId: [
          amenity.id
        ]
      };
      let url = 'aircraft/amenities/' + aircraft.id;

      let that = this;
      this.get('requestSender').ajaxDelete(url, JSON.stringify(param), header)
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
      this.get('requestSender').ajaxPost(url, JSON.stringify(param), header)
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
