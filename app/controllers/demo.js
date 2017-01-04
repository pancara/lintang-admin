import Ember from 'ember';

import Administrator from '../objects/administrator';

export default Ember.Controller.extend({
  actions: {
    dialog() {
      this.get('ui-service').confirm('Hello, world..');
    },

    showMessage() {
      this.get('ui-service').showMessage('heelo...', 1000, 'error');
    }
  }
});
