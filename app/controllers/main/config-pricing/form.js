import Ember from 'ember'
import Operator from '../../../objects/operator';
import JsonUtil from '../../../utils/json-util';

export default Ember.Controller.extend({
  securityService: Ember.inject.service('security-service'),
  dataStub: Ember.inject.service('datastub'),
  pricing: null,

  pricingName: null,
  pricingLevel: null,
  amountType: null,
  pricingValue: null,
  description: null,
  pricingCountType: null,
  pricingCondition: null,
  conditionAmount: null,
  status: null,

  error: false,
  errorMessage: 'Error',
  success: false,

  init() {
    let that = this;
    this.addObserver('pricing', this, function () {
      let pricing = that.get('pricing');
      let properties = {
        pricingName: pricing == null ? null : pricing.pricingName,
        pricingLevel: pricing == null ? null : pricing.pricingLevel,
        amountType: pricing == null ? null : pricing.amountType,
        pricingValue: pricing == null ? null : pricing.pricingValue,
        description: pricing == null ? null : pricing.description,
        pricingCountType: pricing == null ? null : pricing.pricingCountType,
        pricingCondition: pricing == null ? null : pricing.pricingCondition,
        conditionAmount: pricing == null ? null : pricing.conditionAmount,
        status: pricing == null ? null : pricing.status
      };

      that.setProperties(properties);
    });

    this.populateLookups();
  },

  populateLookups() {
    this.set('pricingLevels', this.get('dataStub').getPricingLevels());
    this.set('pricingAmountTypes', this.get('dataStub').getPricingAmountTypes());
    this.set('pricingCountTypes', this.get('dataStub').getPricingCountTypes());
    this.set('pricingConditions', this.get('dataStub').getPricingConditions());
    this.set('pricingStatuses', this.get('dataStub').getPricingStatuses());
  },

  add() {
    let properties = {
      pricing: null,
      pricingName: null,
      pricingLevel: null,
      amountType: null,
      pricingValue: null,
      description: null,
      pricingCountType: null,
      pricingCondition: null,
      conditionAmount: null,
      status: null,

      success: false,
      error: false
    };

    this.setProperties(properties);

  },

  edit(pricing) {

    this.setProperties({
      pricing: pricing,

      pricingName: pricing.pricingName,
      pricingLevel: pricing.pricingLevel,
      amountType: pricing.amountType,
      pricingValue: pricing.pricingValue,
      description: pricing.description,
      pricingCountType: pricing.pricingCountType,
      pricingCondition: pricing.pricingCondition,
      conditionAmount: pricing.conditionAmount,
      status: pricing.status,

      success: false,
      error: false
    })
  },


  actions: {
    selectPricingLevel(pricingLevel) {
      this.set('pricingLevel', pricingLevel);
    },

    selectAmountType(amountType) {
      this.set('amountType', amountType);
    },

    selectPricingCountType(pricingCountType) {
      this.set('pricingCountType', pricingCountType);
    },

    selectPricingCondition(pricingCondition) {
      this.set('pricingCondition', pricingCondition);
    },

    selectPricingStatus(pricingStatus) {
      this.set('status', pricingStatus);
    },

    save() {
      let pricing = this.get('pricing');
      let param = {
        pricingName: this.get('pricingName'),
        pricingLevel: this.get('pricingLevel'),
        amountType: this.get('amountType'),
        pricingValue: this.get('pricingValue'),
        description: this.get('description'),
        pricingCountType: this.get('pricingCountType'),
        pricingCondition: this.get('pricingCondition'),
        conditionAmount: this.get('conditionAmount'),
        status: this.get('status')
      };

      var header = {
        Authorization: this.get('securityService').getAuthBearer()
      };

      let that = this;
      var promise;

      if (pricing == null) {
        let url = 'config/pricing';
        promise = this.get('request-sender').ajaxPost(url, JsonUtil.toJson(param), header);
      } else {
        let url = 'config/pricing/' + pricing.id;
        promise = this.get('request-sender').ajaxPut(url,JsonUtil.toJsony(param), header)
      }

      promise.then(function (json) {
        let prop = {
          errorMessage: 'Data saved',
          error: false,
          success: true

        };
        that.setProperties(prop);
        Ember.run.later(that, function () {
          that.transitionToRoute('main.config-pricing.index');
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
      this.transitionToRoute('main.config-pricing.index');
    }
  }
});

