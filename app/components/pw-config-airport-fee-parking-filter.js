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
  aircraftType: null,

  actions: {
    applyFilter() {
      var filter = {
        icaoCode: this.get('icaoCode'),
        airportName: this.get('airportName'),
        municipality: this.get('municipality'),
        region: this.get('region'),
        country: this.get('country'),

        aircraftType: this.get('aircraftType')
      };

      console.log('send Action "applyFilter"')
      this.sendAction('applyFilter', filter);
    },
    selectAircraftType(aircraftType) {
      this.set('aircraftType', aircraftType);
    }
  }
});
