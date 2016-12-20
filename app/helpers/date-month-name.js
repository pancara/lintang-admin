import Ember from 'ember';
import moment from 'moment';

export function dateMonthName(params/*, hash*/) {
  var month = params[0];
  var date = new Date(2000, month, 1);
  return moment(date).format('MMMM');
}

export default Ember.Helper.helper(dateMonthName);
