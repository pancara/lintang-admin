import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    paging.addObserver('current', this, this.retrieveBookings);
    this.retrieveBookings();
    this.populateLookup();
  },

  populateLookup() {
    this.set('orderTypes', this.get('dataStub').getOrderTypes());
    this.set('bookingStatuses', this.get('dataStub').getBookingStatuses());
  },

  retrieveBookings() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;
    var filter = this.get('filter');

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),

      number: filter.orderNumber,
      status: filter.bookingStatus,
      orderType: filter.orderType,

      operatorCode: filter.operatorCode,
      customerMail: filter.customerMail
    };

    let url = 'order';
    this.get('request-sender').ajaxGet(url, param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let data = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('data', data);
      }, function (reason) {
        that.get('uiService').showMessage('Request data fail. ' + reason.error);
      });
  },

  doCancelBooking(booking) {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let url = 'order/' + booking.id;
    let that = this;
    this.get('request-sender').ajaxPut(url, null, header)
      .then(function (json) {
        that.retrieveBookings();
      }, function (reason) {
        that.get('uiService').showMessage(reason.xhr.responseText);
      });
  },

  doConfirmPayment(booking) {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let url = 'payment/confirm/' + booking.id;
    let that = this;
    this.get('request-sender').ajaxPut(url, null, header)
      .then(function (json) {
        that.retrieveBookings();
      }, function (reason) {
        that.get('uiService').showMessage(reason.xhr.responseText);
      });
  },

  actions: {
    refresh() {
      this.retrieveBookings();
    },

    toggleFilter() {
      this.toggleProperty('shownFilter');
    },

    applyFilter(filter) {
      console.log(filter);
      this.set('filter', filter);
      let current = this.get('paging').get('current');
      if (current != 1) {
        this.get('paging').set('current', 1); // requery data
      } else {
        this.retrieveBookings();
      }
    },

    cancelBooking(booking) {
      if (this.get('uiService').confirm('cancel Order ?')) {
        this.doCancelBooking(booking);
      }
    },

    confirmPayment(booking) {
      if (this.get('uiService').confirm('confirm Payment ?')) {
        this.doConfirmPayment(booking);
      }
    }
  }
});
