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
      var filter = {
        userName: this.get('userName'),
        name: this.get('customerName'),
        phone: this.get('phone'),
        blocked: this.get('blocked'),
        active: this.get('active')
      };

      this.sendAction('applyFilter', filter);
    }
  }
});
