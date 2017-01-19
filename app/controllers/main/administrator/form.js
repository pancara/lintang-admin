import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  firstName: null,
  lastName: null,
  gender: null,
  userName: null,
  password: null,
  confirmation: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
    this.set('genders', this.get('dataStub').getGenders());
    this.set('administratorRoles', this.get('dataStub').getAdministratorRoles());
  },

  reset() {
    //let that = this;
    //let operator = this.get('operatorCtrl').get('operator');
    //this.addObserver('operator', this, function () {
    //  let operator = that.get('operator');
    //  that.set('name', operator.get('name'));
    //  that.set('description', operator.get('description'));
    //  that.set('contactName', operator.get('contactName'));
    //  that.set('contactPhone', operator.get('contactPhone'));
    //  that.set('contactMail', operator.get('contactMail'));
    //
    //
    //  let bankInfo = operator.get('bankInfo');
    //  if (bankInfo != null) {
    //    that.set('bankAccountNumber', bankInfo.account);
    //    that.set('bankAccountName', bankInfo.get('name'));
    //    that.set('bankBranch', bankInfo.get('branch'));
    //
    //    let bank = bankInfo.get('bank');
    //    if (bank != null) {
    //      that.set('bankId', bank.get('id'));
    //    }
    //  }
    //});
  },

  actions: {

    save() {
      let firstName = this.get('firstName');
      let lastName = this.get('lastName');
      let gender = this.get('gender');
      let username = this.get('username');
      let password = this.get('password');
      let confirmation = this.get('confirmation');
      let role = this.get('role');

      if (password === confirmation) {
        let prop = {
          errorMessage: 'Password does not match.',
          error: true,
          success: false
        };
        this.setProperties(prop);
        return;
      }

      let param = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        username: username,
        subRole: role,
        password: this.get('cryptService').encryptPassword(username, password)
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var url = 'admin';
      this.get('request-sender').ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'New administrator created',
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
      this.transitionToRoute('main.operator-user.index');
    },

    selectRole(role) {
      this.set('role', role);
    },

    selectGender(gender) {
      this.set('gender', gender);
    }
  }
});
