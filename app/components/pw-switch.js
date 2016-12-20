import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pw-switch'],
  classNameBindings: ['checked:on:off'],
  attributeBindings: ['tabindex'],
  checked: false,
  tabindex: 0,
  trueText:'ON',
  falseText:'OFF',

  click() {
    this.toggleProperty('checked');
  },
  keyDown(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.toggleProperty('checked');
    }
  }
});
