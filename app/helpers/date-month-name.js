import Ember from 'ember';
import moment from 'moment';
import DateUtil from '../utils/date-util';

export function dateMonthName(params/*, hash*/) {
  var month = params[0];
  return DateUtil.monthName(month);
}

export default Ember.Helper.helper(dateMonthName);
