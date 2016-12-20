import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['pw-table'],
  classNameBindings: ['isZebra:pw-zebra', 'isBordered:pw-bordered'],
  isZebra: false,
  isBordered: true,

  actions: {
    triggerAction(actionName, data, extra) {
      this.sendAction(actionName, data, extra);
    }
  }
});
