import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['pw-navigation'],
  pageCount: 1,
  current: 1,
  rowPerPage: 25,
  totalRow: 20,

  init() {
    this._super();
    this.addObserver('totalRow', this, this.calcPageCount);
  },

  calcPageCount() {
    let pageCount = Math.ceil(this.get('totalRow') / this.get('rowPerPage'));

    this.set('pageCount', pageCount);

    if (this.get('current') > pageCount && pageCount > 0) {
      this.set('current', pageCount);
    }
  },

  actions: {
    refresh() {
      this.sendAction('refresh');
    },

    go(param) {
      console.log(param);

      var current = this.get('current');
      var pageCount = this.get('pageCount');

      if ('first' === param) {
        if (current > 1) {
          this.set('current', 1);
        }
      } else if ('previous' === param) {
        if (current > 1) {
          this.set('current', current - 1);
        }
      } else if ('next' === param) {
        if (current < pageCount) {
          this.set('current', current + 1);
        }
      } else if ('last' === param) {
        this.set('current', pageCount);
      }
    }
  }

});
