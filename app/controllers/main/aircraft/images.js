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


  actions: {
    uploadImage() {
      this.set('selectingAmenity', true);
      let that = this;

      Ember.run.later(this, function () {
        let paging = that.get('paging');
        if (paging != null) {
          paging.addObserver('current', that, that.populateAmenities);
        }
        that.populateAmenities();
      });
    },

    deleteImage(image) {
      console.log(image);
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

    addAmenity(amenity) {
      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let aircraft = this.get('aircraft');
      let that = this;
      let url = 'aircraft/amenities/' + aircraft.id;

      let param = {
        "amenitiesId": [
          amenity.id
        ]
      };

      this.get('requestSender').ajaxPost(url, JSON.stringify(param), header)
        .then(function (json) {
          this.get('aircraft').amenities.pushObject(amenity);
          this.get('uiService').showMessage('Amenity added');
        }, function (reason) {
          that.get('uiService').showMessage('Add amenitiy failed. [' + reason.xhr.responseText + ']')
        });
    },

    refresh() {
      this.populateAmenities();
    }
  }
});
