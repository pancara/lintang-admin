import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import RegisterAsComponent from '../mixins/register-as-component';
import Constant from '../utils/constants';

export default Ember.Component.extend(RegisterAsComponent, {
  tagName: 'div',
  classNames: ['pw-upload'],
  actions: {

    uploadFileChanged() {
      this.set('uploading', true);
      this.set('success', false);
      this.set('error', false);
    },

    uploadProgress(e) {
      this.set('percentage', e.percent);
    },

    uploadError(e) {
      this.set('uploading', false);
      this.set('error', true);
    },

    uploadCompleted(e) {
      this.set('uploading', false);
      this.set('success', true);
    }
  }
});
