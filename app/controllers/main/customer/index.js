import Ember from 'ember'

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),

  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    paging.addObserver('current', this, this.retrieveCustomer);
    this.retrieveCustomer();
  },

  retrieveCustomer() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;
    var filter = this.get('filter');
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),
      username: filter.userName,
      name: filter.name,
      phone: filter.phone,
      isActive: filter.active,
      isBlocked: filter.blocked
    };

    this.get('request-sender').ajaxGet('customer', param, header)
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
      this.retrieveCustomer();
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
        this.retrieveCustomer();
      }
    },

    setStatus(customer) {

      let prompt = customer.isBlocked ? 'Change status to UNBLOCKED' : 'Change status to BLOCKED';
      if (!this.get('ui-service').confirm(prompt)) {
        return;
      }

      let header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let param = {
        isBlocked: !customer.isBlocked
      };

      let that = this;
      this.get('request-sender').ajaxPut('customer/' + customer.id, JSON.stringify(param), header)
        .then(function (json) {
          that.retrieveCustomer();
        }, function (reason) {
        });
    }
  }
});
