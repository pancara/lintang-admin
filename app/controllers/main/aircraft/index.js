import Ember from 'ember'
import Operator from '../../../objects/operator';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('request-sender'),

  uiService: Ember.inject.service('ui-service'),
  addAircraftCtrl: Ember.inject.controller('main.aircraft.add-aircraft'),
  updateProfileCtrl: Ember.inject.controller('main.operator-user.update-profile'),
  updateRoleCtrl: Ember.inject.controller('main.operator-user.update-role'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    console.log('after render');
    let paging = this.get('paging');
    this.retrieveAircraft();
    paging.addObserver('current', this, this.retrieveAircraft);
  },

  retrieveAircraft() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;
    var filter = this.get('filter');

    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),

      code: filter.username,
      model: filter.name,
      yearOfMake: filter.isBlocked,
      maxPassengers: filter.isActive,
      status: filter.status,
      operatorId: null,
      airportId: null
    };

    let url = 'aircraft';
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

  actions: {
    refresh() {
      this.retrieveAircraft();
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

    addAircraft() {
      this.get('addAircraftCtrl').reset();
      this.transitionToRoute('main.aircraft.add-aircraft');
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
      this.get('request-sender').ajaxPut(url, JSON.stringify(param), header)
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
