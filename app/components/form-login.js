import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-login'],
  operatorId: null,
  username: null,
  password: null,
  rememberMe: false,

  keydown() {
    console.log('key down..');
  },
  actions: {
    keyDown() {
      console.log('key down');
    },
    submit() {
      let username= this.get('username');
      let password = this.get('password');
      this.sendAction('doLogin', username, password);
    }
  }
});
