import Ember from 'ember'
import Operator from '../../../objects/operator';
import Constant from '../../../utils/constants';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  configId: null,
  name: null,
  description: null,
  activeStatus: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  afterRender() {
    this.addObserver('paging.current', this, this.retrieveAirport);
  },

  init() {
    let that = this;
    this.addObserver('config', this, function () {
      let config = that.get('config');
      if (config != null) {
        that.set('name', config.name);
        that.set('description', config.description);
        that.set('activeStatus', config.status === 'ACTIVE');
      }
    });
  },

  add() {
    this.setProperties({
      configId: null,
      name: null,
      description: null,
      status: false,

      newEntry: true,
      success: false,
      error: false
    });
  },

  edit(config) {
    this.setProperties({
      configId: config.id,
      name: config.name,
      description: config.description,
      activeStatus: config.status === 'ACTIVE',

      newEntry: false,
      success: false,
      error: false
    })
  },


  actions: {
    save() {
      let param = {
        name: this.get('name'),
        description: this.get('description'),
        status: this.get('activeStatus') ? 'ACTIVE' : 'INACTIVE'
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var response = null;
      let configId = this.get('configId');
      if (configId == null) {
        let url = 'config/amenities';
        response = this.get('request-sender').ajaxPost(url, JsonUtil.toJson(param), header);
      } else {
        let url = 'config/amenities/' + configId;
        response = this.get('request-sender').ajaxPut(url, JsonUtil.toJson(param), header);
      }

      response.then(function (json) {
        let prop = {
          errorMessage: 'Data saved',
          error: false,
          success: true
        };
        that.setProperties(prop);
        Ember.run.later(that, function () {
          that.transitionToRoute('main.config-amenities');
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
      this.transitionToRoute('main.config-amenities');
    }
  }
});
