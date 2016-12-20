import Ember from 'ember';

const ROW_PER_PAGE = 10;

export default Ember.Object.extend({

  page: null,
  count: 100,

  init() {
    this.addObserver('page', this, this.pageChanged);
  },

  reset() {
    this.set('page', 1);
  },

  populate() {
    let data = {
      page: this.get('page'),
      start: this.getRowStart(),
      data: this.createRecords()
    };

    this.set('data', data);
  },

  createRecords() {
    let records = [];

    let start = this.getRowStart();
    for (var i = 0; i < ROW_PER_PAGE; i++) {
      var index = start + i;
      let rec = this.createRecord(index);
      records.push(rec);
    }
    return records;
  },

  createRecord(index) {
    return {
      name: 'Person ' + index,
      address: 'Jakarta ' + index
    };
  },

  goFirst() {
    this.set('page', 1);
  },

  goLast() {
    this.set('page', this.getPageCount());
  },

  goPrevious() {
    let current = this.get('page');
    if (current > 1) {
      this.set('page', current - 1);
    }
  },

  goNext() {
    let pageCount = this.getPageCount();
    var page = this.get('page');
    if (page < pageCount) {
      this.set('page', page + 1);
    }
  },

  getRowStart() {
    return (this.page - 1) * ROW_PER_PAGE;
  },

  getPageCount() {
    return Math.ceil(this.get('count') / ROW_PER_PAGE);
  },

  pageChanged() {
    this.populate();
  }

});
