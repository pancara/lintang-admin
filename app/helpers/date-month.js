import Ember from 'ember';

export function month(params/*, hash*/) {
  return params[0].getMonth() === params[1];
}

export default Ember.Helper.helper(month);
