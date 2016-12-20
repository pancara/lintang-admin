import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['pw-progress-indicator'],
  classNameBindings: ['shown'],
  shown: false,
  init() {
    this._super(...arguments);
    this.get('request-sender').addObserver('requestCount', this, this.updateVisibility);
  },

  updateVisibility() {
    let that = this;
    var shown = that.get('request-sender').get('requestCount') !== 0;
    that.set('shown', shown);
  }
});
