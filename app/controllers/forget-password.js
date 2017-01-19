import Ember from 'ember';
import Constant from '../utils/constants';
import JsonUtil from '../utils/json-util';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),
  hasError: false,
  success: false,
  username: 'koko@cring.id',

  actions: {
    doSubmit(username) {
      var timestamp = this.get('securityService').generateTimestamp();

      var header = {
        'Api-Key': Constant.API_KEY,
        'Date-Time': timestamp,
        'Authorization': this.get('securityService').getAuthKey(timestamp)
      };

      var param = {
        username: username
      };
      let that = this;
      let url = 'password/forget';
      this.get('requestSender').ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.set('hasError', false);
          that.set('success', true);
          that.set('errorMessage', 'Check your email to reset your password.');
        }, function (reason) {
          that.set('hasError', true);
          that.set('success', false);
          if (reason.xhr.status >= 500 || reason.xhr.status === 0) {
            that.set('errorMessage', 'Can not connect to server');
          } else {
            that.set('errorMessage', 'Invalid credentials');
          }
        });
    }
  }
});
