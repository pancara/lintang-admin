import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['profile'],
  classNameBindings: ['shownMenu'],
  attributeBindings: ['tabindex'],
  shownMenu: false,
  tabindex: 0,

  focusOut() {
    this.set('shownMenu', false);
  },

  actions: {
    showMenu() {
      this.set('shownMenu', true);
    },

    fireAction(param) {
      this.set('shownMenu', false);
      this.sendAction(param);
    }
  }

});
