import Ember from 'ember';

export default Ember.Object.extend({

  moveItem(source, dest, option, resultSource, resultDest) {
    for (var i = 0; i < source.length; i++) {
      if (source[i] != option) {
        resultSource.push(source[i]);
      }
    }

    for (var i = 0; i < dest.length; i++) {
      resultDest.push(dest[i]);
    }
    resultDest.push(option);
  },

  moveItemByIndex(souce, dest, index, resultSource, resultDest) {
    var item = source[index];
    this.moveItem(source, dest, item, resultSource.resultDest);
  },

  join(source1, source2, dest) {
    for (var i = 0; i < source1.length; i++) {
      dest.push(source1[i]);
    }
    for (var i = 0; i < source2.length; i++) {
      dest.push(source2[i]);
    }
  }

});
