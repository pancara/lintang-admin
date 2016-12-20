import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  iconName: '',
  classNames: ['iconmenu', 'pageheader-iconmenu'],
  classNameBindings: ['menuVisible'],
  badgeType: 'badge-warning',
  itemCount: 0,
  items: [],
  menuVisible: false,
  attributeBindings: ['tabIndex'],
  tabIndex: 0,

  onHiding: false,

  didInsertElement() {
    this.get('ui-service').applyNiceScroll(this.$('ul'));
  },

  hideMenu() {
    this.set('menuVisible', false);
  },

  focusOut() {
    this.hideMenu();
  },

  click() {
    this.toggleProperty('menuVisible');
  },

  actions: {
    showMenu() {
      this.set('menuVisible', true);
    },

    itemClick(itemData) {
      this.sendAction('onItemSelect', this.get('name'), itemData);
      this.hideMenu();
    }
  }
});
