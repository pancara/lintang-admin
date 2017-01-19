import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  dataStub: Ember.inject.service('datastub'),
  voucher: null,

  code: null,
  voucherType: null,
  kuota: null,
  voucherAmount: null,
  amountType: null,
  maximumVoucherAmount: null,
  minimumPaymentAmount: null,
  status: null,
  orderId: null,

  error: false,
  errorMessage: 'Error',
  success: false,
  inSearchingBooking: false,

  init() {
    let that = this;

    this.addObserver('voucher', this, function () {
      let voucher = that.get('voucher');
      let properties = {
        code: voucher == null ? null : voucher.code,
        voucherType: voucher == null ? null : voucher.voucherType,
        kuota: voucher == null ? null : voucher.kuota,
        voucherAmount: voucher == null ? null : voucher.voucherAmount,
        amountType: voucher == null ? null : voucher.amountType,
        maximumVoucherAmount: voucher == null ? null : voucher.maximumVoucherAmount,
        minimumPaymentAmount: voucher == null ? null : voucher.minimumPaymentAmount,
        status: voucher == null ? null : voucher.status,
        orderId: voucher == null ? null : voucher.orderId
      };

      that.setProperties(properties);
    });

    this.populateLookups();
  },

  populateLookups() {
    this.set('voucherTypes', this.get('dataStub').getVoucherTypes());
    this.set('voucherStatuses', this.get('dataStub').getVoucherStatuses());
    this.set('voucherAmountTypes', this.get('dataStub').getVoucherAmountTypes());
  },

  add() {
    let properties = {
      booking: null,
      voucher: null,

      code: null,
      voucherType: null,
      kuota: null,
      voucherAmount: null,
      amountType: null,
      maximumVoucherAmount: null,
      minimumPaymentAmount: null,
      status: null,
      orderId: null,
      orderNumber: null,

      success: false,
      error: false
    };

    this.setProperties(properties);

  },

  edit(voucher) {

    this.setProperties({
      booking: null,
      voucher: voucher,
      code: voucher.code,
      voucherType: voucher.voucherType,
      amountType: voucher.amountType,
      kuota: voucher.kuota,
      voucherAmount: voucher.voucherAmount,
      maximumVoucherAmount: voucher.maximumVoucherAmount,
      minimumPaymentAmount: voucher.minimumPaymentAmount,
      status: voucher.status,
      orderId: voucher.orderId,
      orderNumber: voucher.order == null ? null : voucher.order.number,

      success: false,
      error: false
    })
  },


  actions: {

    showBookingSearch() {
      this.set('inSearchingBooking', true);
    },

    hideBookingSearch() {
      this.set('inSearchingBooking', false);
    },

    selectVoucherStatus(status) {
      this.set('status', status);
    },

    selectVoucherType(voucherType) {
      this.set('voucherType', voucherType);
    },

    selectAmountType(amountType) {
      this.set('amountType', amountType);
    },

    selectBooking(booking) {
      this.set('booking', booking);
      this.set('orderNumber', booking.number);
    },

    save() {
      let voucher = this.get('voucher');
      var orderId = null;
      let booking = this.get('booking');
      if (booking != null) {
        orderId = booking.id;
      }

      let param = {
        code: this.get('code'),
        voucherType: this.get('voucherType'),
        kuota: this.get('kuota'),
        voucherAmount: this.get('voucherAmount'),
        maximumVoucherAmount: this.get('maximumVoucherAmount'),
        minimumPaymentAmount: this.get('minimumPaymentAmount'),
        amountType: this.get('amountType'),
        status: this.get('status'),
        orderId: orderId
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var promise;

      if (voucher == null) {
        let url = 'voucher';
        promise = this.get('request-sender').ajaxPost(url, JsonUtil.toJson(param), header);
      } else {
        let url = 'voucher/' + voucher.id;
        promise = this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
      }

      promise.then(function (json) {
        let prop = {
          errorMessage: 'Data saved',
          error: false,
          success: true
        };

        that.setProperties(prop);
        Ember.run.later(that, function () {
          that.transitionToRoute('main.voucher.index');
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
      this.transitionToRoute('main.voucher.index');
    }
  }
});

