import Ember from 'ember';

export function add(params/*, hash*/) {
  return params.reduce((sum, x) => sum + x);
}

export default Ember.Helper.helper(add);
