import moment from 'moment';

export default {

  cleanEmptyProperty(obj) {
    if (obj == null)
      return null;

    let that = this;

    Object.keys(obj).forEach(function (key, index) {
      let value = obj[key];
      if (value === '' || value == null) {
        delete obj[key];
      }
      if (typeof value === 'object') {
        that.cleanEmptyProperty(value);
      }
    });

    return obj;
  },

  toJson(obj) {
    let cleanedObj = this.cleanEmptyProperty(obj);
    return JSON.stringify(cleanedObj);
  }
};
