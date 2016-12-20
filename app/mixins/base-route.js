import Ember from 'ember';

export default Ember.Mixin.create({
  activate() {
    this.get('ui-service')
      .applyNiceScroll('body');
  }
});
