import Ember from 'ember';

import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['input-group', 'date'],
  attributeBindings: ['style'],
  value: new Date(),
  $datepicker: null,

  didRender() {
    var that = this;

    var $datepicker = this.$('input').datepicker('update', this.get('value'))
      .on('changeDate', function (e) {
        var value = that.get('value');
        if (value == null) {
          value = new Date();
        }
        value.setFullYear(e.date.getFullYear());
        value.setMonth(e.date.getMonth());
        value.setDate(e.date.getDate());
        that.set('value', value);
      });

    this.set('$datepicker', $datepicker);

  },
  actions: {
    pickDate() {
      this.$datepicker.datepicker('setDate', this.get('value'));
      this.$datepicker.datepicker('show');
    }
  }
});
