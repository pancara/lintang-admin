import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  rows: [],
  mainRowTemplate: null,
  detailRowTemplate: null,
  detailVisible: false,
  actions: {
    toggleDetail() {
      this.toggleProperty("detailVisible");
    },
    triggerAction(actionName, data, extra) {
      this.sendAction('onActionTriggered', actionName, data, extra);
    }
  }
});
