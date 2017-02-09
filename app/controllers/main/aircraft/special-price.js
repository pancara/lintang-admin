import Ember from 'ember'
import Operator from '../../../objects/operator';
import ArrayUtil from '../../../utils/array-util';
import DateUtil from '../../../utils/date-util';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  dataStub: Ember.inject.service('datastub'),
  uiService: Ember.inject.service('ui-service'),
  cryptService: Ember.inject.service('crypt-service'),
  securityService: Ember.inject.service('security-service'),
  requestSender: Ember.inject.service('requestSender'),

  months: DateUtil.getMonths(),

  aircraft: null,
  month: DateUtil.currentMonth(),
  year: DateUtil.currentYear(),
  specialPriceDate: new Date(),
  specialPricePercentage: 0,
  specialPriceDescription: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
  },

  afterRender() {
    this.populateSpecialPrices();

    let paging = this.get('paging');
    if (paging != null) {
      paging.addObserver('current', this, this.populateSpecialPrices);
    }
  },

  reset() {
    this.set('aircraft', null);

    this.set('error', false);
    this.set('success', false);
  },

  populateSpecialPrices() {
    let aircraft = this.get('aircraft');

    if (aircraft == null) return;



    let paging = this.get('paging');
    var rowPerPage = 30;
    var current = 1;
    if (paging != null) {
      paging.set('rowPerPage', 30);
      current = paging.get('current');
    }

    let that = this;
    let param = {
      limit: rowPerPage,
      page: current,
      aircraftId: aircraft.id,
      month: parseInt(this.get('month')) + 1, // month is 1 base
      year: this.get('year')
    };

    Ember.$.extend(param, this.get('filter'));
    let url = 'aircraft/specialprice';
    let header = {
      Authorization: this.get('securityService').getAuthBearer()
    };
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
        that.refreshData();
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

    let selectedSpecialPrice = this.get('selectedSpecialPrice');

    let that = this;
    let aircraft = this.get('aircraft');
    if (selectedSpecialPrice == null) {
      let url = 'aircraft/specialprice/' + aircraft.id;
      this.get('requestSender')
        .ajaxPost(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.set('editMode', false);
          that.refreshData();
        }, function (reason) {
          that.get('uiService').showMessage('Add special price failed. [' + reason.xhr.responseText + ']')
        });
    } else {
      let url = 'aircraft/specialprice/' + selectedSpecialPrice.id;
      this.get('requestSender')
        .ajaxPut(url, JsonUtil.toJson(param), header)
        .then(function (json) {
          that.set('editMode', false);
          that.refreshData();
        }, function (reason) {
          that.get('uiService').showMessage('Update special price failed. [' + reason.xhr.responseText + ']')
        });
    }
  },

  refreshData() {
    if (this.get('paging').get('current') == 1) {
      this.populateSpecialPrices();
    } else {
      this.get('paging').set('current', 1);
    }
  },

  actions: {
    deleteSpecialPrice(specialPrice) {
      this.doDelete(specialPrice);
    },

    editSpecialPrice(specialPrice) {
      this.set('selectedSpecialPrice', specialPrice);

      this.set('specialPriceDate', new Date(specialPrice.date));
      this.set('specialPricePercentage', specialPrice.percentageOfPrice);
      this.set('specialPriceDescription', specialPrice.description);

      this.set('editMode', true);
    },

    addSpecialPrice() {
      this.set('selectedSpecialPrice', null);

      this.set('specialPriceDate', new Date());
      this.set('specialPricePercentage', 0);
      this.set('specialPriceDescription', null);
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
    },

    selectMonth(month) {
      this.set('month', month);
      this.refreshData();
    },

    yearChange() {
      this.refreshData();
    }

  }
});
