import Ember from 'ember';

import Administrator from '../objects/administrator';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),

  init() {
    this.set('menus', this.get('dataStub').getMainMenu());
    this.set('administrator', Administrator.create());
  },

  getProfile() {
    let that = this;
    var header = {
      'Authorization': that.get('securityService').getAuthBearer()
    };
    this.get('requestSender').ajaxGet('admin/profile', null, header)
      .then(function (json) {
        that.set('administrator', Administrator.create(json));
      }, function (reason) {
      });
  },

  actions: {
    selectRoute(routeName, param) {
      if (param === undefined) {
        this.transitionToRoute(routeName);
      } else {
        this.transitionToRoute('main', param);
      }
    },

    updateUserProfile() {
      this.transitionToRoute('main.user-profile');
    },

    changePassword() {
      this.transitionToRoute('main.change-password');
    },

    refreshToken() {
      var header = {
        'Authorization': this.get('securityService').getRefreshTokenBasic()
      };

      var promise = this.get('requestSender').ajaxGet('token', null, header);
      let that = this;
      promise.then(function (json) {
        that.get('securityService').saveAccessToken(json);
      }, function () {
      });
    },

    // logout action
    logout() {
      var header = {
        'Authorization': this.get('securityService').getAuthBearer()
      };
      let that = this;

      this.get('requestSender').ajaxDelete('authenticate', null, header)
        .then(function () {
          that.get('securityService').doLogout();
        }, function () {
        });
      this.transitionToRoute('login');
    }
  }
});
