import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,

  code: null,
  model: null,
  yearOfMake: null,
  maxPassengers: null,
  status: null,

  actions: {
    applyFilter() {
      var filter = {
        code: this.get('code'),
        model: this.get('model'),
        yearOfMake: this.get('yearOfMake'),
        maxPassengers: this.get('maxPassengers'),
        status: this.get('status') ? 'ACTIVE' : 'INACTIVE'

      };
      this.sendAction('applyFilter', filter);
    }
  }
});
