import Ember from 'ember'
import Operator from '../../../objects/operator';


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

  reset() {
    let that = this;
    let operator = this.get('operatorCtrl').get('operator');
    this.addObserver('operator', this, function () {
      let operator = that.get('operator');
      that.set('name', operator.get('name'));
      that.set('description', operator.get('description'));
      that.set('contactName', operator.get('contactName'));
      that.set('contactPhone', operator.get('contactPhone'));
      that.set('contactMail', operator.get('contactMail'));


      let bankInfo = operator.get('bankInfo');
      if (bankInfo != null) {
        that.set('bankAccountNumber', bankInfo.account);
        that.set('bankAccountName', bankInfo.get('name'));
        that.set('bankBranch', bankInfo.get('branch'));

        let bank = bankInfo.get('bank');
        if (bank != null) {
          that.set('bankId', bank.get('id'));
        }
      }
    });
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
      this.get('request-sender').ajaxPost('operator', JSON.stringify(param), header)
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
