import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-login'],
  operatorId: null,
  username: null,
  password: null,
  rememberMe: false,

  keydown() {
  },
  actions: {
    keyDown() {
    },
    submit() {
      let username= this.get('username');
      let password = this.get('password');
      this.sendAction('doLogin', username, password);
    }
  }
});
