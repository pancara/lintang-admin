import Ember from 'ember';

export function dateEq(params/*, hash*/) {
  let date1 = params[0];
  let date2 = params[1];
  if (date1 == null) return false;
  if (date2 == null) return false;

  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

}

export default Ember.Helper.helper(dateEq);
