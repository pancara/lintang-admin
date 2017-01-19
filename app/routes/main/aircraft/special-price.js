import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    Ember.run.schedule('afterRender', controller, controller.afterRender);
    let aircraft = controller.get('aircraft');
    if (aircraft == null) {
      this.transitionTo('main.aircraft');
    }
  }

});
