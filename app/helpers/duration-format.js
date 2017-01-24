import Ember from 'ember';

export function durationFormat(params/*, hash*/) {
  var value = params[0];

  var minutes = value % 60;
  var hours = (value - minutes ) / 60;
  return (hours > 0) ? hours + 'h ' + minutes.toFixed(2) + 'm' : minutes.toFixed(2) + 'm';
}

export default Ember.Helper.helper(durationFormat);
