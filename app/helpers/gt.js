import Ember from 'ember';

export function or(params/*, hash*/) {
  let val1 = params[0];
  let val2 = params[1];

  return val1 > val2;
}

export default Ember.Helper.helper(or);
