import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,
  userName: null,
  customerName: null,
  phone: null,
  blocked: false,
  active: true,

  actions: {
    applyFilter() {
      let aircraft = this.get('aircraft');
      let customer = this.get('customer');
      let operator = this.get('operator');

      var filter = {
        orderNumber: this.get('orderNumber'),
        bookingStatus: this.get('bookingStatus'),
        orderType: this.get('orderType'),
        aircraftId: aircraft == null ? null : aircraft.id,
        customerId: customer == null ? null : customer.id,
        operatorId: operator == null ? null : operator.id
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
