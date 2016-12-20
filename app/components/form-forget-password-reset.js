import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-login'],
  username: null,
  token: null,
  password: null,

  actions: {
    submit() {
      let username = this.get('username');
      let token = this.get('token');
      let password = this.get('password');
      this.sendAction('resetPassword', username, token, password);
    }
  }
});
