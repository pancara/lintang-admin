import Ember from 'ember'
import Administrator from '../../objects/administrator';
import DataFactory from'../../utils/data-factory';

import JsonUtil from '../../utils/json-util';

export default Ember.Controller.extend({
  editMode: false,
  formData: Administrator.create(),
  genderList: DataFactory.getGenderList(),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),

  actions: {

    selectGender(gender) {
      this.get('formData').set('gender', gender);
    },

    edit() {
      this.set('editMode', true);
      this.get('formData').setProperties(this.get('profile'));
    },

    save() {
      let that = this;
      let params = {
        firstName: this.get('formData').get('firstName'),
        lastName: this.get('formData').get('lastName'),
        gender: this.get('formData').get('gender')
      };

      let header = {
        'Authorization': that.get('securityService').getAuthBearer()
      };

      this.get('requestSender').ajaxPut('admin/profile', JsonUtil.toJson(params), header).then(function (json) {
        that.get('profile').setProperties(that.get('formData'));
        that.set('editMode', false);
      }, function () {
      });

    },
    cancel() {
      this.set('editMode', false);
    }
  }
});
