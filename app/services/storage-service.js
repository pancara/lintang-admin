import Ember from 'ember';
import JsonUtil from '../utils/json-util';

export default Ember.Service.extend({
  salt: 'lintang-admin',

  rememberMeKey: 'lintang-admin.rememberMe',
  sessionKey: 'lintang-admin.session',
  accessTokenKey: 'lintang-admin.token',

  saveAccessToken(token) {
    this.save(this.get('accessTokenKey'), token);
  },

  getAccessToken() {
    return this.load(this.get('accessTokenKey'));
  },

  removeAccessToken() {
    this.remove(this.get('accessTokenKey'));
  },

  saveRememberMe(json) {
    this.save(this.get('rememberMeKey'), json);
  },

  loadRememberMe() {
    return this.load(this.get('rememberMeKey'));
  },

  removeRememberMe() {
    this.remove(this.get('rememberMeKey'));
  },

  saveSession(json) {
    this.save(this.get('sessionKey'), json);
  },

  loadSession() {
    return this.load(this.get('sessionKey'));
  },

  removeSession() {
    this.remove(this.get('sessionKey'));
  },

  save(key, value) {
    var jsonText = JsonUtil.toJson(value);
    localStorage.setItem(key, this.encrypt(jsonText));
  },

  load(key) {
    var cypherText = localStorage.getItem(key);
    if (cypherText == null) {
      return null;
    }

    var plain = this.decrypt(cypherText);
    return JSON.parse(plain);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  encrypt(plain) {
    return CryptoJS.AES.encrypt(plain, this.get('salt')).toString();
  },

  decrypt(crypt) {
    return CryptoJS.AES.decrypt(crypt, this.get('salt')).toString(CryptoJS.enc.Utf8);
  }


});
