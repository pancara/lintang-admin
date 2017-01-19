import moment from 'moment';

export default {
  currentYear() {
    return new Date().getFullYear();
  },

  currentMonth() {
    return new Date().getMonth();
  },

  monthName(month) {
    var date = new Date(2000, month, 1);
    return moment(date).format('MMMM');
  },

  getMonths() {
    let months = [];
    for (var i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  }
};
