import Ember from 'ember'
import Constant from '../../../utils/constants';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  baseUrl: Constant.SERVER_URL,
  configFormCtrl: Ember.inject.controller('main.config-amenities.form'),
  data: null,
  shownFilter: false,
  filter: {},

  afterRender() {
    let paging = this.get('paging');
    if (paging != null) {
      paging.addObserver('current', this, this.retrieveConfigs);
      this.retrieveConfigs();
    }

    this.set('aircraftTypes', this.get('datastub').getAircraftTypes());
  },

  retrieveConfigs() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    paging.set('rowPerPage', 20);
    let that = this;
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current')
    };

    Ember.$.extend(param, this.get('filter'));
    this.get('request-sender').ajaxGet('config/amenities', param, header)
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
    toggleFilter() {
      this.toggleProperty('shownFilter');
    },
    add() {
      this.get('configFormCtrl').add();
      this.transitionToRoute('main.config-amenities.form');
    },

    edit(config) {
      this.get('configFormCtrl').edit(config);
      this.transitionToRoute('main.config-amenities.form');
    },

    delete(config) {
      var prompt = 'Delete Amenity ' + config.name + ' ?';
      if (this.get('ui-service').confirm(prompt)) {

        var header = {
          Authorization: this.get('securityService').getAuthBearer()
        };

        let that = this;
        let url = 'config/amenities/' + config.id;
        this.get('request-sender').ajaxDelete(url, null, header)
          .then(function (json) {
            that.retrieveConfigs();
          }, function (reason) {
            this.get('ui-service').showMessage('Delete failed..');
          });
      }
    },

    refresh() {
      this.retrieveConfigs();
    },

    applyFilter(filter) {
      this.set('filter', filter);
      let current = this.get('paging').get('current');

      if (current != 1) {
        this.get('paging').set('current', 1); // requery data
      } else {
        this.retrieveConfigs();
      }
    },

    uploadFileChanged(config) {
      this.get('ui-service').showMessage('Uploading..');
    },

    uploadProgress(config, e) {
      console.log(config);
      console.log(e);
    },

    uploadError(config) {
      this.get('ui-service').showMessage('Upload error..');
    },

    uploadCompleted(config) {
      console.log('upload completed');
      this.retrieveConfigs();
    }

  }
});
