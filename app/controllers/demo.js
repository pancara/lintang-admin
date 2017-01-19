import Ember from 'ember';

import Administrator from '../objects/administrator';

import JsonUtil from '../utils/json-util';

export default Ember.Controller.extend({

  actions: {
    testJson() {
      let a = {
        prop1: 'data',
        prop2: '',
        prop3: null,
        prop4: {
          prop4_1: null,
          prop4_2: 'value',
          prop4_3: ''
        }

      }
    },

    dialog() {
      this.get('ui-service').confirm('Hello, world..');
    },

    showMessage() {
      this.get('ui-service').showMessage('heelo...', 1000, 'error');
    }
  }
});
