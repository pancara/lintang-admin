import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    Ember.run.schedule('afterRender', controller, controller.afterRender);
  }

});
