import Ember from 'ember'
import Operator from '../../../objects/operator';


export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  config: null,
  value: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
    let that = this;
    this.addObserver('config', this, function () {
      let config = that.get('config');
      if (config != null) {
        that.set('value', config.configValue);
      }
    });
  },

  actions: {
    save() {
      let param = {
        configValue: this.get('value')
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      let url = 'config/default/' + this.get('config').id;
      this.get('request-sender').ajaxPut(url, JSON.stringify(param), header)
        .then(function (json) {
          let prop = {
            errorMessage: 'Data saved',
            error: false,
            success: true
          };
          that.setProperties(prop);
          Ember.run.later(that, function () {
            that.transitionToRoute('main.config-default.index');
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
      this.transitionToRoute('main.config-default.index');
    }
  }
});
