import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar'],
  activeMenus: [],
  expandedMenus: [],
  collapsed: false,

  didInsertElement() {
    this.get('ui-service').applyNiceScroll(this.$())
  },


  onToggleCollapse: Ember.observer('collapsed', function () {
    this.$().parent().toggleClass('collapsed');
  }),

  activateMenu(menu) {
    var oldActiveMenus = this.get('activeMenus');

    if ((oldActiveMenus.length > 0) && (oldActiveMenus[0] == menu)) {
      return;
    }

    let activeMenus = [];
    var m = menu;
    while (m != null) {
      activeMenus.push(m);
      m.set('active', true);
      m = m.get('parent');
    }

    this.set('activeMenus', activeMenus);
    this.deactivateMenu(oldActiveMenus);
  },

  deactivateMenu(menus) {
    if (menus.length == 0) {
      return;
    }

    // until menus.length - 1
    // because last item is sidebar.
    for (var i = 0; i < menus.length - 1; i++) {
      if (!this.inActiveList(menus[i])) {
        menus[i].set('active', false);
        menus[i].set('expanded', false);
      }
    }
  },

  inActiveList(menu) {
    let activeMenus = this.get('activeMenus');
    for (var i = 0; i < activeMenus.length; i++) {
      if (menu == activeMenus[i])
        return true;
    }

    return false;
  },

  toggleMenuExpand(menu) {
    var oldExpandedMenus = this.get('expandedMenus');

    menu.toggleProperty('expanded');
    let expanded = menu.get('expanded');
    if (expanded) {
      let expandedMenus = [menu];
      var parent = menu.parent;
      while (parent != null) {
        expandedMenus.push(parent);
        //parent.set('expanded', true);
        parent = parent.get('parent');
      }
      this.set('expandedMenus', expandedMenus);
    }

    // populate collapsed menus
    for (var i = 0; i < oldExpandedMenus.length; i++) {
      let m = oldExpandedMenus[i];
      if (!this.inExpandedList(m)) {
        m.set('expanded', false);
      }
    }
  },

  inExpandedList(menu) {
    let expandedMenus = this.get('expandedMenus');
    for (var i = 0; i < expandedMenus.length; i++) {
      if (menu == expandedMenus[i])
        return true;
    }

    return false;
  },

  actions: {
    menuCreated(menu) {
      menu.set('parent', this);
    },

    menuSelected(menu) {
      this.activateMenu(menu);
      if (!menu.get('hasChild')) {
        let routeName = menu.get('routeName');
        this.sendAction('onSelectRoute', routeName);

        let uiService = this.get('ui-service');
        if (uiService.isSmallScreen()) {
          this.toggleProperty('collapsed');
        }
      }
    },

    menuToggleExpand(menu) {
      this.toggleMenuExpand(menu);
    },

    buttonToggleCollapsed() {
      this.toggleProperty('collapsed');
    }
  }

});
