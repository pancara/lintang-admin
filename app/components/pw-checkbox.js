import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['pw-checkbox'],
  classNameBindings: ['checked'],
  attributeBindings: ['tabindex'],
  checked: false,
  tabindex: 0,
  text: 'Remember Me',
  mouseDown() {
    var checked = this.get('checked') ? false : true;
    this.set('checked', checked);
  }
});
