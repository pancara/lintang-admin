import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Service.extend({
  moment: Ember.inject.service(),
  storageService: Ember.inject.service('storage-service'),
  cryptService: Ember.inject.service('crypt-service'),

  saveCurrentUser(username) {
    this.get('storageService').save('lintang-admin.current-user', username);
  },

  getCurrentUser() {
    return this.get('storageService').load('lintang-admin.current-user');
  },

  removeCurrentUser() {
    this.get('storageService').remove('lintang-admin.current-user');
  },

  getAuthKey(timestamp) {
    return this.get('cryptService').getAuthKey(timestamp);
  },

  getRefreshTokenBasic() {
    return 'Basic ' + this.get('storageService').getAccessToken().refreshToken;
  },

  getAuthBearer() {
    let accessToken = this.get('storageService').getAccessToken();
    return (accessToken == null) ? null : 'Bearer ' + accessToken.accessToken;
  },

  saveAccessToken(json) {
    let currentToken = this.get('storageService').getAccessToken();

    var token = {
      accessToken: json.access_token,
      expiredIn: json.expires_in,
      refreshToken: json.refresh_token ? json.refresh_token : currentToken.refreshToken,
      refreshTokenExpiredIn: json.refresh_token_expired ? json.refresh_token_expired : currentToken.refreshTokenExpiredIn
    };

    this.get('storageService').saveAccessToken(token);
  },

  removeAccessToken() {
    this.get('storageService').removeAccessToken();
  },

  generateTimestamp() {
    return this.get('moment').moment(new Date()).format(Constant.SYSTEM_DATE_FORMAT)
  },

  doLogout() {
    this.removeAccessToken();
    this.removeCurrentUser();
  }

});
