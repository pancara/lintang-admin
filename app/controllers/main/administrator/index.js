import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  securityService: Ember.inject.service('security-service'),
  uiService: Ember.inject.service('ui-service'),
  formCtrl: Ember.inject.controller('main.administrator.form'),
  profileCtrl: Ember.inject.controller('main.administrator.profile'),
  roleCtrl: Ember.inject.controller('main.administrator.role'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    this.retrieveData();
    paging.addObserver('current', this, this.retrieveData);
    this.set('administratorRoles', this.get('dataStub').getAdministratorRoles());
  },

  retrieveData() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;
    var filter = this.get('filter');
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),

      username: filter.username,
      name: filter.name,
      isBlocked: filter.isBlocked,
      isActive: filter.isActive,
      role: filter.role
    };

    let url = 'admin';
    this.get('request-sender').ajaxGet(url, param, header)
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

  actions: {
    refresh() {
      this.retrieveData();
    },

    toggleFilter() {
      this.toggleProperty('shownFilter');
    },

    applyFilter(filter) {
      this.set('filter', filter);
      let current = this.get('paging').get('current');
      if (current != 1) {
        this.get('paging').set('current', 1); // requery data
      } else {
        this.retrieveData();
      }
    },

    add() {
      this.get('formCtrl').reset();
      this.transitionToRoute('main.administrator.form');
    },

    updateProfile(administrator) {
      this.get('profileCtrl').set('administrator', administrator);
      this.transitionToRoute('main.administrator.profile');

    },
    updateRole(administrator) {
      this.get('roleCtrl').set('administrator', administrator);
      this.transitionToRoute('main.administrator.role');
    },

    blockAdministrator(admin) {
      let prompt = admin.isBlocked ? 'Change administrator status to UNBLOCKED' : 'Change status to BLOCKED';
      if (!this.get('uiService').confirm(prompt)) {
        return;
      }

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let param = {
        isBlocked: !admin.isBlocked
      };

      let that = this;
      let url = 'admin/block/' + admin.id;
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.retrieveData();
        }, function (reason) {
        });
    },

    deleteAdministrator(admin) {
      let prompt = 'Remove administrator ?';

      if (!this.get('uiService').confirm(prompt)) {
        return;
      }

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'admin/' + admin.id;
      this.get('request-sender').ajaxDelete(url, null, header)
        .then(function (json) {
          that.retrieveData();
        }, function (reason) {
        });
    }
  }
});
