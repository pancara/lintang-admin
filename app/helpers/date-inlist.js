import Ember from 'ember';

export function dateInlist(params/*, hash*/) {
  let date = params[0];
  let list = params[1];

  for (var i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.getDate() === date.getDate() &&
      item.getMonth() === date.getMonth() &&
      item.getFullYear() === date.getFullYear()) {
      return true;
    }
  }

  return false;
}

export default Ember.Helper.helper(dateInlist);
