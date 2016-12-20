import Ember from 'ember'
import Administrator from '../../objects/administrator';
import DataFactory from'../../utils/data-factory';

export default Ember.Controller.extend({
  editMode: false,
  formData: Administrator.create(),
  genderList: DataFactory.getGenderList(),

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
        'Authorization': that.get('security-service').getAuthBearer()
      };

      this.get('request-sender').ajaxPut('admin/profile', JSON.stringify(params), header).then(function (json) {
        that.get('profile').setProperties(that.get('formData'));
        that.set('editMode', false);
      }, function () {
        console.log('error..');
      });

    },
    cancel() {
      this.set('editMode', false);
    }
  }
});
