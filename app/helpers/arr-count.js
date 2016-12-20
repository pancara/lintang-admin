import Ember from 'ember';

export function arrCount(params/*, hash*/) {
  if (params[0] == null) return 0;
  return params[0].length;
}

export default Ember.Helper.helper(arrCount);
