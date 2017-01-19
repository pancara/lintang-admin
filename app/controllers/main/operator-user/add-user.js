import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  operator: null,
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
    this.set('operatorRoles', this.get('dataStub').getOperatorRoles());
    if (this.get('searchMode')) {
      this.populateOperators();
    }
  },


  populateOperators() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;

    let keyword = this.get('keyword');
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),
      code: keyword
    };

    let url = 'operator';
    this.get('requestSender').ajaxGet(url, param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let data = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('data', data);
      }, function (reason) {
      });
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
    searchOperator(searchMode) {
      this.set('searchMode', searchMode);
      if (this.get('paging')) {
        this.populateOperators();
      }
    },

    selectOperator(operator) {
      this.set('operator', operator);
    },

    refreshOperators() {

    },

    doSearchOperator() {
      this.populateOperators();
    },

    save() {
      let firstName = this.get('firstName');
      let lastName = this.get('lastName');
      let gender = this.get('gender');
      let username = this.get('username');
      let password = this.get('password');
      let confirmation = this.get('confirmation');
      let role = this.get('role');

      if (this.get('operator') == null) {
        let prop = {
          errorMessage: 'Operator empty.',
          error: true,
          success: false
        };
        this.setProperties(prop);
        return;
      }

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
      var url = 'operatoruser/' + this.get('operator').id;
      this.get('request-sender').ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'New operator created',
            error: false,
            success: true
          };
          that.setProperties(prop);
          Ember.run.later(that, function () {
            that.transitionToRoute('main.operator.index');
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
