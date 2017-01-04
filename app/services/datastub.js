import Ember from 'ember';

//import Booking from '../objects/booking';
//import Aircraft from '../objects/aircraft';


export default Ember.Service.extend({

  getMainMenu() {
    let mnuAircraft = this.createMenuObject('main.aircraft', 'plane', 'AIRCRAFT', false, null);


    let submenuOperator = this.createMenuObject('main.operator', 'building', 'OPERATOR', false, null);
    let submenuOperatorUser = this.createMenuObject('main.operator-user', 'user', 'USER', false, null);
    let mnuOperator = this.createMenuObject('main.operator', 'building', 'OPERATOR', true,
      [submenuOperator, submenuOperatorUser]);

    let mnuBooking = this.createMenuObject('main.booking', 'bookmark', 'BOOKING', false, null);
    //let mnuConfig = this.createMenuObject('main.configuration', 'wrench', 'CONFIGURATION', false, null);
    let mnuCustomer = this.createMenuObject('main.customer', 'group', 'CUSTOMER', false, null);

    let submenuConfigDefault = this.createMenuObject('main.config-default', null, 'DEFAULT', false, null);
    let submenuConfigAmenities = this.createMenuObject('main.config-amenities', null, 'AMENITIES', false, null);
    let submenuConfigAirportFeeLanding = this.createMenuObject('main.config-airport-fee-landing', null, 'AIRPORT FEE LANDING', false, null);
    let submenuConfigAirportFeeParking = this.createMenuObject('main.config-airport-fee-parking', null, 'AIRPORT FEE PARKING', false, null);
    let submenuConfigPricing = this.createMenuObject('main.config-pricing', null, 'PRICING', false, null);

    let mnuConfig = this.createMenuObject('main.config', 'wrench', 'CONFIG', true,
      [submenuConfigDefault, submenuConfigAirportFeeLanding, submenuConfigAirportFeeParking, submenuConfigAmenities, submenuConfigPricing]);


    let menus = [mnuAircraft, mnuOperator, mnuBooking, mnuCustomer, mnuConfig];

    return menus;
  },

  createMenuObject(routeName, iconName, labelText, hasChild, submenus) {
    return {
      routeName: routeName,
      iconName: iconName,
      labelText: labelText,
      hasChild: hasChild,
      submenus: submenus
    };
  },

  getOperatorStatuses() {
    return ['ACTIVE', 'INACTIVE'];
  },

  getAircraftStatuses() {
    return ['ACTIVE', 'INACTIVE'];
  },

  getAmenitiesStatuses() {
    return ['ACTIVE', 'INACTIVE'];
  },

  getAircraftTypes() {
    return ['ULTRA_LONG_RANGE',
      'HEAVY_JET',
      'SUPER_MID_SIZE_JET',
      'MID_SIZE_JET',
      'ENTRY_LEVEL_JET',
      'TURBO_PROP',
      'PROP',
      'HELI'];
  },

  getGenders() {
    return ['MALE', 'FEMALE'];
  },

  getOperatorRoles() {
    return ['OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_USER'];
  },

  getPricingLevels() {
    return [1, 2, 3, 4, 5];
  },
  getPricingAmountTypes() {
    return ['RUPIAH', 'PERCENTAGE'];
  },

  getPricingCountTypes() {
    return ['BEFORE_DISCOUNT', 'AFTER_DISCOUNT', 'AFTER_DISCOUNT_AND_SERVICE'];
  },

  getPricingConditions() {
    return ['NO_CONDITION', 'MORE_THAN_AMOUNT', 'LESS_THAN_AMOUNT', 'CREDIT_CARD_PAYMENT'];
  },

  getPricingStatuses() {
    return ['ACTIVE', 'INACTIVE'];
  },

  getBookingReasons() {
    return ['BOOKED', 'MAINTENANCE', 'PRIVATE_USE', 'OFFLINE_BOOKED', 'OTHER'];
  },

  getBookingStatuses() {
    return ['CREATED', 'CANCELED', 'PAID'];
  },

  getOrderTypes() {
    return ['CHARTER', 'DEAL', 'SHUTTLE'];
  },

  getAircrafts() {
    return {
      "count": 0,
      "data": [
        {
          "model": "Airbus A319",
          "registrationNumber": "N-X-211",
          "aircraftType": "ULTRA_LONG_RANGE",
          "safetyRating": "FAA IASA Category 1",
          "description": "The most comfortable way to fly",
          "yearOfMake": "2010",
          "maxPassengers": "15",
          "speedKts": "510",
          "speedKmh": "700",
          "maxRangeKm": "8000",
          "maxRangeNm": "5000",
          "basePrice": "500000",
          "marginPrice": "100000",
          "status": "ACTIVE",
          "id": "10",
          "code": "PWXONJ12",
          "base": {
            "id": "1",
            "icaoCode": "WIHH",
            "iataCode": "CGK",
            "name": "Halim Perdana Kusumah",
            "description": "Halim Perdana Kusumah",
            "point": {
              "latitude": "234.00",
              "longitude": "14.00"
            },
            "municipality": "Jakarta",
            "region": "Jakarta Raya",
            "country": "Indonesia"
          },
          "operator": {
            "name": "Lintang Air",
            "description": "Value for money Private Jet Charter service",
            "contactName": "Badu Badu PhD.",
            "contactPhone": "0888864279",
            "contactMail": "trisna@lintang.id",
            "id": "21",
            "bankInfo": {
              "branch": "Cibubur",
              "account": "123456780",
              "name": "Trisna Wanto",
              "bank": {
                "id": "50",
                "code": "012",
                "name": "Bank Mandiri"
              }
            },
            "code": "PWXOMJ21",
            "status": "ACTIVE",
            "fee": "5.0"
          },
          "images": [
            {
              "id": 1,
              "url": null,
              //"url": "aircraft/uwjwlkwo99.jpg",
              "description": "Front View",
              "isMainImage": "true"
            }
          ],
          "amenities": [
            {
              "name": "WIFI",
              "description": "All in WIFI service",
              "status": "ACTIVE",
              "id": 1,
              "logo": "amenities/ioieu3999"
            }
          ]
        }
      ]
    };

  }

});
