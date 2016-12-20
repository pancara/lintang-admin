import Ember from 'ember'
import Operator from '../../../objects/operator';


export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  user: null,
  role: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
    this.set('userRoles', this.get('dataStub').getOperatorRoles());
  },

  actions: {

    save() {
      let role = this.get('role');

      if (role == null || role.length === 0) {
        let prop = {
          errorMessage: 'Role is empty.',
          error: true,
          success: false
        };
        this.setProperties(prop);
        return;
      }

      let param = {
        subRole: role
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var url = 'operatoruser/role/' + this.get('user').id;
      this.get('request-sender').ajaxPut(url, JSON.stringify(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Role updated',
            error: false,
            success: true
          };
          that.setProperties(prop);
          Ember.run.later(that, function () {
            that.transitionToRoute('main.operator-user.index');
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
    }
  }
});
