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
    doLogin(username, password) {
      var timestamp = this.get('securityService').generateTimestamp();

      var header = {
        'Api-Key': Constant.API_KEY,
        'Date-Time': timestamp,
        'Authorization': this.get('cryptService').getAuthKey(timestamp)
      };

      var param = {
        username: username,
        password: this.get('cryptService').encryptPassword(username, password, timestamp)
        //password: this.get('crypt-service').encryptPassword('trisna@lintang.id', password, timestamp)
      };

      var promise = this.get('requestSender').ajaxPost(
        'authenticate',
        JSON.stringify(param),
        header
      );

      let that = this;
      promise.then(function (json) {
        that.set('hasError', false);
        that.set('success', true);
        that.set('errorMessage', 'Redirecting to secured area...');
        that.get('securityService').saveAccessToken(json);
        that.get('securityService').saveCurrentUser(username);

        Ember.run.later(this, function () {
          that.transitionToRoute('main.user-profile');
        }, 1500);

      }, function (reason) {
        that.set('hasError', true);
        that.set('success', false);
        console.log(reason.xhr.status);
        if (reason.xhr.status >= 500 || reason.xhr.status === 0) {
          that.set('errorMessage', 'Can not connect to server');
        } else {
          that.set('errorMessage', 'Invalid credentials');
        }
      });
    }
  }
});
