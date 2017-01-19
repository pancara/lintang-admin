import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  administrator: null,
  firstName: null,
  lastName: null,
  gender: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
    this.set('genders', this.get('dataStub').getGenders());
  },


  init() {
    this._super(...arguments);
    let that = this;

    this.addObserver('administrator', this, function () {
      let administrator = that.get('administrator');
      that.set('firstName', administrator.firstName);
      that.set('lastName', administrator.lastName);
      that.set('gender', administrator.gender);
    });
  },

  actions: {
    save() {
      let firstName = this.get('firstName');
      let lastName = this.get('lastName');
      let gender = this.get('gender');

      let param = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var url = 'admin/' + this.get('administrator').id;
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Profile updated',
            error: false,
            success: true
          };
          that.setProperties(prop);
          Ember.run.later(that, function () {
            that.transitionToRoute('main.administrator.index');
          }, 500);

        }, function (reason) {
          let prop = {
            errorMessage: reason.xhr.responseText,
            error: true,
            success: false
          };
          that.setProperties(prop);
        });
    },

    cancel() {
      this.transitionToRoute('main.administrator.index');
    },

    selectGender(gender) {
      this.set('gender', gender);
    }
  }
});
