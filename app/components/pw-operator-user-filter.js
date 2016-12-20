import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  dataStub: Ember.inject.service('datastub'),
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,

  username: null,
  name: null,
  role: null,
  isActive: null,
  isBlocked: null,

  actions: {

    applyFilter() {
      let username = this.get('username');
      let name = this.get('name');
      let isActive = this.get('isActive') ? 'ACTIVE' : 'INACTIVE';
      let isBlocked = this.get('isBlocked') ? 'BLOCKED' : 'UNBLOCKED';
      let role = this.get('role');

      var filter = {
        username: username,
        name: name,
        isActive: isActive,
        isBlocked: isBlocked,
        role: role
      };

      this.sendAction('applyFilter', filter);
    },

    selectOperatorRole(role) {
      this.set('role', role);
    }
  }
});
