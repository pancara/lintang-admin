import Ember from 'ember';

export function or(params/*, hash*/) {

  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    if (param === true) {
      return true;
    }
  }
  return false;
}

export default Ember.Helper.helper(or);
