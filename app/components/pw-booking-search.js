import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),

  classNames: ['panel', 'panel-default'],

  didInsertElement() {
    this.retrieveBookings();
    this.get('paging').addObserver('current', this, this.retrieveBookings);
  },

  retrieveBookings() {

    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');

    let that = this;
    var keyword = this.get('keyword');

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),

      number: keyword,
      customerMail: keyword
    };

    let url = 'order';
    this.get('requestSender').ajaxGet(url, param, header)
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

  actions: {

    search() {
      var paging = this.get('paging');
      if (paging.get('current') == 1) {
        this.retrieveBookings();
      } else {
        paging.set('current', 1);
      }
    },

    close() {
      this.sendAction('close');
    },

    refresh() {
      this.retrieveBookings();
    },

    selectBooking(booking) {
      this.sendAction('selectBooking', booking);
    }
  }
});
