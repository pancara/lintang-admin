import Ember from 'ember';
import BaseRoute from '../mixins/base-route';

export default Ember.Route.extend(BaseRoute, {
  securityService: Ember.inject.service('security-service'),

  beforeModel(transition) {
    let currentUser = this.get('securityService').getCurrentUser();
    if (currentUser == null) {
      this.transitionTo('login');
    }
  },

  setupController(controller, model) {
    Ember.run.schedule('afterRender', controller, controller.getProfile);
  }
});
