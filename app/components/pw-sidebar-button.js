import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar-button'],

  didInsertElement() {
    let div = '<div>&nbsp;</div>';
    for (var i = 0; i < 3; i++) {
      this.$().append(div);
    }
  },

  click() {
    this.sendAction('toggleCollapse', this);
  }
});
