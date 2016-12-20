import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'panel-default', 'panel-filter'],
  classNameBindings: ['shown'],
  shown: true,
  icaoCode: null,
  airportName: null,
  municipality: null,
  region: null,
  country: null,

  actions: {
    applyFilter() {

      var filter = {
        icaoCode: this.get('icaoCode'),
        airportName: this.get('airportName'),
        municipality: this.get('municipality'),
        region: this.get('region'),
        country: this.get('country'),
      };

      this.sendAction('applyFilter', filter);
    }
  }
});
