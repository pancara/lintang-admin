import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,
  code: null,
  name: null,
  status: false,

  actions: {
    applyFilter() {
      let code = this.get('code');
      let name = this.get('name');
      let status = this.get('status') ? 'ACTIVE' : 'INACTIVE';

      var filter = {
        code: (code != null && code.length > 1) ? code : null,
        name: (name != null && name.length > 1) ? name : null,
        status: status
      };

      this.sendAction('applyFilter', filter);
    }
  }
});
