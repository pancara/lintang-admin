import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';
import DateUtil from '../../../utils/date-util';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  month: DateUtil.currentMonth(),
  year: DateUtil.currentYear(),
  aircraft: null,

  bookingDate: new Date(),
  reason: null,
  description: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
  },

  afterRender() {
    this.populateLookups();
    this.populateBookingDates();
  },

  reset() {
    this.set('aircraft', null);

    this.set('error', false);
    this.set('success', false);
  },

  populateLookups() {
    this.set('months', DateUtil.getMonths());
    this.set('bookingReasons', this.get('dataStub').getBookingReasons());
  },

  populateBookingDates() {
    let aircraft = this.get('aircraft');

    if (aircraft == null) {
      return;
    }

    let paging = this.get('paging');
    var rowPerPage = 30;
    var current = 1;
    if (paging != null) {
      paging.set('rowPerPage', 30);
      current = paging.get('current');
    }

    let that = this;
    let param = {
      limit: rowPerPage,
      page: current,
      aircraftId: aircraft.id,
      month: parseInt(this.get('month')) + 1, // month is 1 base
      year: this.get('year')
    };

    Ember.$.extend(param, this.get('filter'));
    let url = 'aircraft/unavailability';

    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };
    this.get('requestSender').ajaxGet(url, param, header)
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

  doDelete(booking) {
    if (!this.get('uiService').confirm('Remove booking data ' + booking.description + ' ?')) {
      return;
    }

    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let url = 'aircraft/unavailability/' + booking.id;
    let that = this;

    this.get('requestSender').ajaxDelete(url, null, header)
      .then(function (json) {
        that.refreshData();
      }, function (reason) {
        that.get('uiService').showMessage('Delete booking failed. [' + reason.xhr.responseText + ']')
      });
  },

  doSave() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };


    let bookingDate = this.get('bookingDate');
    let reason = this.get('reason');
    let description = this.get('description');

    let param = {
      date: bookingDate,
      reason: reason,
      description: description
    };

    let that = this;

    let selectedBooking = this.get('selectedBooking');
    if (selectedBooking == null) {
      let aircraft = this.get('aircraft');
      let url = 'aircraft/unavailability/' + aircraft.id;

      this.get('requestSender').ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.refreshData();
          that.set('editMode', false);
        }, function (reason) {
          that.get('uiService').showMessage('Add data failed. [' + reason.xhr.responseText + ']')
        });
    } else {
      let url = 'aircraft/unavailability/' + selectedBooking.id;

      this.get('requestSender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.refreshData();
          that.set('editMode', false);
        }, function (reason) {
          that.get('uiService').showMessage('Add data failed. [' + reason.xhr.responseText + ']')
        });
    }
  },


  refreshData() {
    if (this.get('paging').get('current') == 1) {
      this.populateBookingDates();
    } else {
      this.get('paging').set('current', 1);
    }
  },

  actions: {
    deleteBooking(booking) {
      this.doDelete(booking);
    },

    addBooking() {
      this.populateLookups();
      this.set('selectedBooking', null);

      this.set('bookingDate', new Date());
      this.set('reason', null);
      this.set('description', null);

      this.set('editMode', true);
    },

    editBooking(booking) {
      this.populateLookups();
      this.set('selectedBooking', booking);

      this.set('bookingDate', new Date(booking.date));
      this.set('reason', booking.reason);
      this.set('description', booking.description);

      this.set('editMode', true);
    },

    saveData() {
      this.doSave();
    },

    cancelData() {
      this.set('editMode', false);
    },

    refresh() {
      this.populateBookingDates();
    },

    selectBookingReason(reason) {
      this.set('reason', reason);
    },

    selectMonth(month) {
      this.set('month', month);
      this.refreshData();
    },

    yearChange() {
      this.refreshData();
    }
  }
});
