import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    let operator = controller.get('operator');
    if (operator == null) {
      this.transitionTo('main.operator');
    }
  }
});
