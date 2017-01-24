import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  aircraft: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
  },

  reset() {
    this.set('aircraft', null);

    this.set('error', false);
    this.set('success', false);
  },

  retrieveAircraft() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let aircraft = this.get('aircraft');
    let url = 'aircraft/' + aircraft.id;

    let that = this;
    this.get('request-sender').ajaxGet(url, null, header)
      .then(function (json) {
        that.set('aircraft', json);
      }, function (reason) {
      });
  },

  actions: {
    deleteImage(image) {
      if (!this.get('uiService').confirm('Remove aircraft picture ?')) {
        return;
      }

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let aircraft = this.get('aircraft');
      let that = this;
      let url = 'aircraft/image/' + image.id;

      this.get('requestSender').ajaxDelete(url, null, header)
        .then(function (json) {
          Ember.set(aircraft, 'images', ArrayUtil.removeObject(aircraft.images, image))
        }, function (reason) {
          that.get('uiService').showMessage('Delete image failed. [' + reason.xhr.responseText + ']')
        });
    },

    setMainImage(image) {
      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'aircraft/image/' + image.id;

      this.get('requestSender').ajaxPut(url, null, header)
        .then(function (json) {
          Ember.set(image, 'isMainImage', true);
          that.get('uiService').showMessage('Aircraft main image changed');
          that.retrieveAircraft();
        }, function (reason) {
          that.get('uiService').showMessage('Set aircraft main image failed. [' + reason.xhr.responseText + ']')
        });
    },

    refresh() {
      this.populateImages();
    },

    uploadImageCompleted() {
      this.retrieveAircraft();
    }
  }
});
