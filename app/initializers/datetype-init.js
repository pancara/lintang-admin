import moment from 'moment';

export function initialize(/* application */) {

  Date.prototype.toJSON = function () {
    return moment(this).format('YYYY-MM-DDTHH:mm:ss.SSS');
  }

}

export default {
  name: 'datetype-init',
  initialize
};
