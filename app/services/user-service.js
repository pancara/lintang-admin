import Ember from 'ember';

export default Ember.Service.extend({
  currentUser: null,

  authenticate(operatorId, userName, password) {
    return (userName === 'operator');
  }
});
