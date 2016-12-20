import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,
  name: null,
  status: true,

  actions: {
    applyFilter() {
      var filter = {
        name: this.get('name'),
        status: this.get('status') ? 'ACTIVE' : 'INACTIVE'
      };
      this.sendAction('applyFilter', filter);
    }
  }
});
