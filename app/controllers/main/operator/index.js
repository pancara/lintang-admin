import Ember from 'ember'
import Operator from '../../../objects/operator';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),

  operatorFormCtrl: Ember.inject.controller('main.operator.form'),
  operatorFeeCtrl: Ember.inject.controller('main.operator.fee'),
  operatorStatusCtrl: Ember.inject.controller('main.operator.status'),
  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    this.retrieveOperator();
    paging.addObserver('current', this, this.retrieveOperator);
  },

  retrieveOperator() {

    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    let that = this;
    var filter = this.get('filter');
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current'),
      code: filter.code,
      name: filter.name,
      status: filter.status
    };

    this.get('request-sender').ajaxGet('operator', param, header)
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
      this.retrieveOperator();
    },

    add() {
      this.get('operatorFormCtrl').resetForm();
      this.transitionToRoute('main.operator.form');
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
        this.retrieveOperator();
      }
    },

    changeStatus(operator) {
      this.get('operatorStatusCtrl').reset();
      this.get('operatorStatusCtrl').set('operator', operator);
      this.transitionToRoute('main.operator.status');

    },
    changeFee(operator) {
      this.get('operatorFeeCtrl').reset();
      this.get('operatorFeeCtrl').set('operator', operator);
      this.transitionToRoute('main.operator.fee');
    }
  }
});
