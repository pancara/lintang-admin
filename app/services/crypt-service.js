import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Service.extend({

  getAuthKey(timestamp) {
    return 'Key ' + this.digestSHA256(this.digestSHA256(Constant.API_KEY + this.digestSHA256(Constant.SECRET_KEY)) + timestamp);
  },

  encryptPassword(username, password, timestamp) {
    if (timestamp == null) {
      return this.digestSHA256(username + this.digestSHA256(password));
    } else {
      return this.digestSHA256(this.digestSHA256(username + this.digestSHA256(password)) + timestamp);
    }
  },

  digestSHA256(plain) {
    var crypted = CryptoJS.SHA256(plain).toString();
    return crypted;
  },

  encryptAES(plain) {
    return CryptoJS.AES.encrypt(plain, this.get('salt')).toString();
  },

  decryptAES(crypt) {
    return CryptoJS.AES.decrypt(crypt, this.get('salt')).toString(CryptoJS.enc.Utf8);
  }

});
