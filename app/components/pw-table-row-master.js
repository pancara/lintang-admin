import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  detailCollapsed: true,
  actions: {
    toggleDetail() {
      this.sendAction("onToggleDetail");
    },

    click(actionName, data) {
      this.sendAction('onActionTriggered', actionName, data);
    }
  }
});
