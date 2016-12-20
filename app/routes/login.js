import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    this._super();
  },
  setupController(controller, model) {
    controller.setProperties({
      hasError: false,
      success: false,
      rememberMe: false
    });
  }
});
