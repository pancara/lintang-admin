import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['input-group', 'pw-timepicker'],
  attributeBindings: ['style'],
  value: new Date(),
  widget: null,

  didInsertElement() {
    console.log('disInsertElement');
    var that = this;

    var widget = this.$('input').timepicker({
      minuteStep: 1,
      showMeridian: false,
      maxHours: 24
    });

    widget.timepicker('setTime', this.get('value'))
      .on('changeTime.timepicker', function (e) {
        var value = that.get('value');
        value.setHours(e.time.hours);
        value.setMinutes(e.time.minutes);
        value.setSeconds(e.time.seconds);
      }
    );

    this.set('widget', widget);
  },
  actions: {
    showWidget() {
      console.log('showWidget');
      let widget = this.get('widget');
      this.$(widget).timepicker('showWidget');
    }
  }
});
