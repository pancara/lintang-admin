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

    let mnuBooking = this.createMenuObject('main.booking', 'wrench', 'BOOKING', false, null);
    //let mnuConfig = this.createMenuObject('main.configuration', 'wrench', 'CONFIGURATION', false, null);
    let mnuCustomer = this.createMenuObject('main.customer', 'group', 'CUSTOMER', false, null);

    let submenuConfigDefault = this.createMenuObject('main.config-default', null, 'DEFAULT', false, null);
    let submenuConfigAmenities = this.createMenuObject('main.config-amenities', null, 'AMENITIES', false, null);
    let submenuConfigAirportFeeLanding = this.createMenuObject('main.config-airport-fee-landing', null, 'AIRPORT FEE LANDING', false, null);
    let submenuConfigAirportFeeParking = this.createMenuObject('main.config-airport-fee-parking', null, 'AIRPORT FEE PARKING', false, null);

    let mnuConfig = this.createMenuObject('main.config', 'wrench', 'CONFIG', true,
      [submenuConfigDefault, submenuConfigAirportFeeLanding, submenuConfigAirportFeeParking, submenuConfigAmenities]);


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
  }

});
