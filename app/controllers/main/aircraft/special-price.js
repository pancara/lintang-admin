import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  aircraft: null,
  specialPriceDate: new Date(),
  specialPricePercentage: 0,
  specialPriceDescription: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
  },

  afterRender() {
  },

  reset() {
    this.set('aircraft', null);

    this.set('error', false);
    this.set('success', false);
  },

  populateSpecialPrices() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let paging = this.get('paging');
    paging.set('rowPerPage', 30);
    let that = this;
    let param = {
      limit: paging.get('rowPerPage'),
      page: paging.get('current')
    };

    Ember.$.extend(param, this.get('filter'));
    let url = 'config/specialprice';
    this.get('requestSender').ajaxGet(url, param, header)
      .then(function (json) {
        paging.set('totalRow', json.count);
        let specialPriceList = {
          start: (paging.get('current') - 1) * paging.get('rowPerPage'),
          data: json.data
        };
        that.set('specialPriceList', specialPriceList);
      }, function (reason) {
      });
  },

  doDelete(specialPrice) {
    if (!this.get('uiService').confirm('Remove special price ' + specialPrice.description + ' ?')) {
      return;
    }

    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };

    let url = 'aircraft/specialprice/' + specialPrice.id;
    let that = this;

    this.get('requestSender').ajaxDelete(url, null, header)
      .then(function (json) {
        let specialPriceList = that.get('specialPriceList');
        Ember.set(that, 'specialPriceList', ArrayUtil.removeObject(specialPriceList, specialPrice))
      }, function (reason) {
        that.get('uiService').showMessage('Delete special-price failed. [' + reason.xhr.responseText + ']')
      });
  },

  doSave() {
    var header = {
      Authorization: this.get('securityService').getAuthBearer()
    };


    let specialPriceDate = this.get('specialPriceDate');
    let specialPricePercentage = this.get('specialPricePercentage');
    let specialPriceDescription = this.get('specialPriceDescription');

    let param = {
      date: specialPriceDate,
      percentageOfPrice: specialPricePercentage,
      description: specialPriceDescription
    };
    let that = this;

    let selectedSpecialPrice = this.get('selectedSpecialPrice');
    if (selectedSpecialPrice == null) {
      let aircraft = this.get('aircraft');
      let url = 'aircraft/specialprice/' + aircraft.id;

      this.get('requestSender').ajaxPost(url, JSON.stringify(param), header)
        .then(function (json) {
        }, function (reason) {
          that.get('uiService').showMessage('Add amenitiy failed. [' + reason.xhr.responseText + ']')
        });
    } else {

    }
  },

  actions: {
    deleteSpecialPrice(specialPrice) {
      this.doDelete(specialPrice);
    },

    addSpecialPrice() {
      this.set('editMode', true);
    },

    saveData() {
      this.doSave();
    },

    cancelData() {
      this.set('editMode', false);
    },

    refresh() {
      this.populateSpecialPrices();
    }
  }
});
