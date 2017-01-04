import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import RegisterAsComponent from '../mixins/register-as-component';
import Constant from '../utils/constants';

export default Ember.Component.extend(RegisterAsComponent, {
  tagName: 'span',
  classNames: ['pw-progressbar'],

  init() {
    this._super(...arguments);

    //let that = this;
    //this.addObserver('percentage', function () {
    //  let percentage = that.get('percentage');
    //  that.$('>div').css({
    //    width: percentage + '%'
    //  });
    //});
  }
});
