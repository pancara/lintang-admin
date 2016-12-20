import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'option',
  attributeBindings: ['option.value:value'],
  option: null,

  click() {
    console.log('item select');
    this.sendAction('itemSelect', this.get('option'));
  },
  doubleClick() {
    this.sendAction('itemAction', this.get('option'));
  }
});
