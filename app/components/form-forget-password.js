import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-login'],
  operatorId: null,
  username: null,
  password: null,
  rememberMe: false,

  actions: {
    submit() {
      let username = this.get('username');
      this.sendAction('doSubmit', username);
    }
  }
});
