import Ember from 'ember';
import BaseRoute from '../mixins/base-route';

export default Ember.Route.extend(BaseRoute, {

  setupController(controller, model) {
    Ember.run.schedule('afterRender', controller, controller.getProfile);
  }
});
