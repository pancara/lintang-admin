import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  administrator: null,
  role: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
    this._super(...arguments);
    this.addObserver('administrator', this, this.setSubRole);
  },

  setSubRole() {
    this.set('subRole', this.get('administrator').subRole);
  },

  afterRender() {
    this.set('administratorRoles', this.get('dataStub').getAdministratorRoles());
  },

  actions: {

    save() {
      let subRole = this.get('subRole');

      if (subRole == null || subRole.length === 0) {
        let prop = {
          errorMessage: 'Role is empty.',
          error: true,
          success: false
        };
        this.setProperties(prop);
        return;
      }

      let param = {
        subRole: subRole
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var url = 'admin/role/' + this.get('administrator').id;
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Role updated',
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


    selectSubRole(subRole) {
      this.set('subRole', subRole);
    }
  }
});
