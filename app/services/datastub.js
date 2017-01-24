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

    let mnuVoucher = this.createMenuObject('main.voucher', 'tag', 'VOUCHER', false, null);
    let mnuUsers = this.createMenuObject('main.administrator', 'group', 'USERS', false, null);

    let submenuConfigDefault = this.createMenuObject('main.config-default', null, 'DEFAULT', false, null);
    let submenuConfigAmenities = this.createMenuObject('main.config-amenities', null, 'AMENITIES', false, null);
    let submenuConfigAirportFeeLanding = this.createMenuObject('main.config-airport-fee-landing', null, 'AIRPORT FEE LANDING', false, null);
    let submenuConfigAirportFeeParking = this.createMenuObject('main.config-airport-fee-parking', null, 'AIRPORT FEE PARKING', false, null);
    let submenuConfigPricing = this.createMenuObject('main.config-pricing', null, 'PRICING', false, null);

    let mnuConfig = this.createMenuObject('main.config', 'wrench', 'CONFIG', true,
      [submenuConfigDefault, submenuConfigAirportFeeLanding, submenuConfigAirportFeeParking, submenuConfigAmenities, submenuConfigPricing]);

    let menus = [mnuAircraft, mnuOperator, mnuBooking, mnuCustomer, mnuVoucher, mnuUsers, mnuConfig];

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

  getAdministratorRoles() {
    return ['ADMIN', 'ADMIN_SUPERVISOR', 'SUPER_ADMIN'];
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
    return ['MAINTENANCE', 'PRIVATE_USE', 'OFFLINE_BOOKED', 'OTHER'];
  },

  getBookingStatuses() {
    return ['CREATED', 'CANCELED', 'PAID', 'CONFIRMED'];
  },

  getOrderTypes() {
    return ['CHARTER', 'DEAL', 'SHUTTLE'];
  },

  getVoucherTypes() {
    return ['PAYMENT_VOUCHER', 'DISCOUNT_VOUCHER'];
  },

  getVoucherStatuses() {
    return ['ACTIVE', 'INACTIVE'];
  },

  getVoucherAmountTypes() {
    return ['RUPIAH', 'PERCENTAGE'];
  }

});
