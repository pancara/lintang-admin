import Ember from 'ember';

export default Ember.Mixin.create({
  didInsertElement: function () {
    this._super(...arguments);
    this.set('register-as', this);
  }
});
