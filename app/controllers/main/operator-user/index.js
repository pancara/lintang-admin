import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  securityService: Ember.inject.service('security-service'),
  uiService: Ember.inject.service('ui-service'),
  addUserCtrl: Ember.inject.controller('main.operator-user.add-user'),
  updateProfileCtrl: Ember.inject.controller('main.operator-user.update-profile'),
  updateRoleCtrl: Ember.inject.controller('main.operator-user.update-role'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    this.retrieveUser();
    paging.addObserver('current', this, this.retrieveUser);
    this.set('operatorRoles', this.get('dataStub').getOperatorRoles());
  },

  retrieveUser() {
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

    let url = 'operatoruser';
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
      this.retrieveUser();
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
        this.retrieveUser();
      }
    },

    addUser() {
      this.get('addUserCtrl').reset();
      this.transitionToRoute('main.operator-user.add-user');
    },

    updateProfile(user) {
      this.get('updateProfileCtrl').set('user', user);
      this.transitionToRoute('main.operator-user.update-profile');

    },
    updateRole(user) {
      this.get('updateRoleCtrl').set('user', user);
      this.transitionToRoute('main.operator-user.update-role');
    },

    blockUser(user) {
      let prompt = user.isBlocked ? 'Change user status to UNBLOCKED' : 'Change status to BLOCKED';
      if (!this.get('uiService').confirm(prompt)) {
        return;
      }

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let param = {
        isBlocked: !user.isBlocked
      };

      let that = this;
      let url = 'operatoruser/block/' + user.id;
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.retrieveUser();
        }, function (reason) {
        });
    },

    deleteUser(user) {
      let prompt = 'Remove user ?';

      if (!this.get('uiService').confirm(prompt)) {
        return;
      }

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'operatoruser/' + user.id;
      this.get('request-sender').ajaxDelete(url, null, header)
        .then(function (json) {
          that.retrieveUser();
        }, function (reason) {
        });
    }
  }
});
