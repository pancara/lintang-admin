import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  cryptService: Ember.inject.service('crypt-service'),
  requestSender: Ember.inject.service('request-sender'),
  error: false,
  success: false,
  errorMessage: null,

  reset() {
    var values = {
      oldPassword: null,
      newPassword: null,
      confirmation: null,
      error: false,
      success: false
    };

    this.setProperties(values);
  },

  actions: {
    save() {
      let oldPassword = this.get('oldPassword');
      let newPassword = this.get('newPassword');
      let confirmation = this.get('confirmation');

      console.log(oldPassword);
      if (oldPassword === undefined || oldPassword == null || oldPassword === '') {
        console.log('old password empty');
        let prop = {
          errorMessage: 'Please, enter your old password',
          error: true
        };
        this.setProperties(prop);
        return;
      }

      if (newPassword !== confirmation) {
        let prop = {
          errorMessage: 'Password confirmation does not match',
          error: true
        };
        this.setProperties(prop);
        return;
      }

      let that = this;
      let currentUser = that.get('securityService').getCurrentUser();

      let params = {
        oldPassword: this.get('cryptService').encryptPassword(currentUser, oldPassword),
        newPassword: this.get('cryptService').encryptPassword(currentUser, newPassword)
      };

      let header = {
        'Authorization': that.get('securityService').getAuthBearer()
      };

      this.get('requestSender').ajaxPut('password', JSON.stringify(params), header).then(function (json) {
        let prop = {
          errorMessage: 'Password updated',
          error: false,
          success: true
        };
        that.setProperties(prop);
      }, function (reason) {
        let prop = {
          errorMessage: reason.xhr.responseText,
          error: true
        };
        that.setProperties(prop);
      });
    },

    cancel() {
      this.reset();
    }
  }
});
