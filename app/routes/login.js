import Ember from 'ember';
import BaseRoute from '../mixins/base-route';


export default Ember.Route.extend(BaseRoute, {

  setupController(controller, model) {
    controller.setProperties({
      hasError: false,
      success: false,
      rememberMe: false
    });
  }
});
