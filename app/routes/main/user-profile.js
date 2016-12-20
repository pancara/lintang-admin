import Ember from 'ember';
import Administrator from '../../objects/administrator';

export default Ember.Route.extend({
  securityService: Ember.inject.service('security-service'),

  activate() {
    let that = this;

    let header = {
      'Authorization': that.get('securityService').getAuthBearer()
    };

    this.get('request-sender').ajaxGet('admin/profile', null, header).then(function (json) {
      that.controllerFor('main.user-profile').set('profile', Administrator.create(json));
    }, function () {
      console.log('error..');
    });
  }
});
