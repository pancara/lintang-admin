import Ember from 'ember';

export default Ember.Component.extend({
  iconName: 'user',
  hasChild: false,
  expanded: false,
  active: false,
  routeName: 'main',
  tagName: 'li',
  classNameBindings: ['hasChild', 'expanded', 'active'],

  init() {
    this._super(...arguments);
    this.sendAction('onCreated', this);
  },

  actions: {
    click() {
      let hasChild = this.get('hasChild');
      if (hasChild) {
        this.sendAction('onToggleExpand', this);
      } else {
        this.sendAction('onSelect', this);
      }
    },

    submenuToggleExpand(submenu) {
      this.sendAction('onToggleExpand', submenu);
    },

    submenuCreated(submenu) {
      submenu.set('parent', this);
    },

    submenuSelected(submenu) {
      this.sendAction('onSelect', submenu);
    }
  }

});
