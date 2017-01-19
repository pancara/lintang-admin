import Ember from 'ember';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({

  securityService: Ember.inject.service('security-service'),

  init() {
    this._super();
    let that = this;
    this.addObserver('operator', this, function () {
      that.set('status', this.get('operator').status);
    });

    this.set('statusOptions', this.get('datastub').getOperatorStatuses());
  },

  reset() {
    this.set('error', false);
    this.set('success', false);
  },

  actions: {
    save() {
      let param = {
        status: this.get('status')
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'operator/status/' + this.get('operator').id;
      this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Status updated',
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

    selectStatus(status) {
      this.set('status', status);
    }
  }
});
