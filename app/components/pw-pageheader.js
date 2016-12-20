import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['page-header'],
  componentIconName: 'icon',
  actions: {
    requestLogout() {
      var pos = this.$('.btn-logout').offset();
      var confirm = window.confirm('Logout ?');
      if (confirm) {
        this.sendAction('logout');
      }
    },

    iconMenuItemSelect(name, data) {
      var route;
      if (name === 'newbooking') {
        route = 'main.booking.active';
      }
      //this.sendAction('selectRoute', route, data);
      this.sendAction('selectRoute', route);
    },

    userProfile() {
      this.sendAction('updateUserProfile');
    },

    changePassword() {
      this.sendAction('changePassword');
    },

    refreshToken() {
      this.sendAction('refreshToken');
    },

    logout() {
      this.sendAction('logout');
    }
  }
});
