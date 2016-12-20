import Ember from 'ember';

export function arrSlice(params/*, hash*/) {
  var source = params[0];
  var subarrayCount = params[1];
  var subarrayIndex = params[2];

  var itemCount = Math.ceil(source.length / subarrayCount);
  var start = itemCount * subarrayIndex;

  var end = start + itemCount;
  end = end > source.length ? source.length : end;

  var result = [];
  var index = 0;
  for (var i = start; i < end; i++) {
    result[index] = source[i];
    index++;
  }
  return result;
}

export default Ember.Helper.helper(arrSlice);
