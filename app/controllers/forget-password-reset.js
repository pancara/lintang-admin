import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  cryptService: Ember.inject.service('crypt-service'),
  requestSender: Ember.inject.service('request-sender'),
  hasError: false,
  success: false,
  rememberMe: false,
  username: 'koko@cring.id',
  password: 'Jakarta2014!',

  actions: {
    resetPassword(username, token, password) {
      var timestamp = this.get('securityService').generateTimestamp();

      var header = {
        'Api-Key': Constant.API_KEY,
        'Date-Time': timestamp,
        'Authorization': this.get('securityService').getAuthKey(timestamp)
      };

      var param = {
        username: username,
        token: token,
        newpassword: this.get('cryptService').encryptPassword(username, password, timestamp)
      };

      let that = this;
      let url = 'password/forget'
      this.get('requestSender').ajaxPut(url, JSON.stringify(param), header)
        .then(function (json) {
          that.set('hasError', false);
          that.set('success', true);
          that.set('errorMessage', 'Password updated.');
          that.get('securityService').saveAccessToken(json);
          that.get('securityService').saveCurrentUser(username);

          Ember.run.later(this, function () {
            that.transitionToRoute('main.login');
          }, 1500);

        }, function (reason) {
          that.set('hasError', true);
          that.set('success', false);
          if (reason.xhr.status >= 500 || reason.xhr.status === 0) {
            that.set('errorMessage', 'Can not connect to server');
          } else {
            that.set('errorMessage', 'Invalid inputs');
          }
        });
    }
  }
});
