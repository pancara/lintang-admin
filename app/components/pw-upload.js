import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import RegisterAsComponent from '../mixins/register-as-component';
import Constant from '../utils/constants';

export default EmberUploader.FileField.extend(RegisterAsComponent, {

  securityService: Ember.inject.service('security-service'),

  init() {
    this._super(...arguments);
    this.set('percentage', null);
    this.set('uploading', false);
    this.set('error', false);
  },


  filesDidChange: function (files) {
    this.sendAction('uploadFileChanged');

    let url = Constant.SERVER_URL + this.get('url');
    //let url = 'http://posttestserver.com/post.php';
    let uploader = EmberUploader.Uploader.create({
      url: url,
      headers: {
        Authorization: this.get('securityService').getAuthBearer()
      }
    });

    this.set('uploading', false);
    this.set('error', false);

    let that = this;
    uploader.on('progress', e => {
      that.set('percentage', e.percent);
      that.sendAction('uploadProgress', e);
    });

    uploader.on('didUpload', e => {
      that.sendAction('uploadCompleted');
    });

    uploader.on('error', e => {
      that.sendAction('uploadError', e);
      this.set('uploading', false);
      this.set('error', true);
    });

    if (!Ember.isEmpty(files)) {
      var extra = {};
      this.set('uploading', true);
      uploader.upload(files[0], extra);
    }
  }

});
