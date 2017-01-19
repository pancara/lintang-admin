import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),

  operatorCtrl: Ember.inject.controller('main.operator'),
  name: '',
  description: '',
  contactName: '',
  contactPhone: '',
  contactMail: '',
  bankAccountNumber: '',
  bankAccountName: '',
  bankBranch: '',
  bankId: null,

  error: false,
  errorMessage: 'Error',
  success: false,


  resetForm() {
    //let operator = this.get('operator');
    //if (operator != null) {
    //  this.set('name', operator.get('name'));
    //  this.set('description', operator.get('description'));
    //  this.set('contactName', operator.get('contactName'));
    //  this.set('contactPhone', operator.get('contactPhone'));
    //  this.set('contactMail', operator.get('contactMail'));
    //
    //
    //  let bankInfo = operator.get('bankInfo');
    //  if (bankInfo != null) {
    //    this.set('bankAccountNumber', bankInfo.account);
    //    this.set('bankAccountName', bankInfo.get('name'));
    //    this.set('bankBranch', bankInfo.get('branch'));
    //
    //    let bank = bankInfo.get('bank');
    //    if (bank != null) {
    //      this.set('bankId', bank.get('id'));
    //    }
    //  }
    //} else {
      this.set('name', null);
      this.set('description', null);
      this.set('contactName', null);
      this.set('contactPhone', null);
      this.set('contactMail', null);

      this.set('bankAccountNumber', null);
      this.set('bankAccountName', null);
      this.set('bankBranch', null);
      this.set('bankId', null);
    //}
  },

  populateBank() {
    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let that = this;
    this.get('request-sender').ajaxGet('info/bank', null, header)
      .then(function (json) {
        let banks = [];
        for (var i = 0; i < json.length; i++) {
          var bank = {
            id: json[i].id,
            code: json[i].code,
            name: json[i].name,
            text: json [i].code + '  ' + json[i].name
          }
          banks.push(bank);
        }
        that.set('banks', banks);
      }, function (reason) {
      });
  },

  actions: {
    save() {
      let param = {
        name: this.get('name'),
        description: this.get('description'),
        contactName: this.get('contactName'),
        contactPhone: this.get('contactPhone'),
        contactMail: this.get('contactMail'),
        bankInfo: {
          branch: this.get('bankBranch'),
          account: this.get('bankAccountNumber'),
          name: this.get('bankAccountName'),
          bank: {
            id: this.get('bankId')
          }
        }
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      this.get('request-sender').ajaxPost('operator', JsonUtil.toJson(param), header)
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
      this.transitionToRoute('main.operator.index');
    },

    selectBank(bankId) {
      this.set('bankId', bankId);
    }
  }
});
