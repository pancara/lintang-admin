import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,
  orderNumber: null,
  bookingStatus: null,
  customerMail: null,
  operatorCode: null,

  actions: {
    applyFilter() {

      var filter = {
        orderNumber: this.get('orderNumber'),
        bookingStatus: this.get('bookingStatus'),
        orderType: this.get('orderType'),
        customerMail: this.get('customerMail'),
        operatorCode: this.get('operatorCode')
      };

      this.sendAction('applyFilter', filter);
    },

    selectBookingStatus(status) {
      this.set('bookingStatus', status);
    },

    selectOrderType(orderType) {
      this.set('orderType', orderType);
    }
  }
});
