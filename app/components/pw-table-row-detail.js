import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    click(actionName, data, extra) {
      this.sendAction('onActionTriggered', actionName, data, extra);
    }
  }
});
