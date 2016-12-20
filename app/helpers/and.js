import Ember from 'ember';

export function and(params/*, hash*/) {

  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    if (param === false) {
      return false;
    }
  }
  return true;
}

export default Ember.Helper.helper(and);
