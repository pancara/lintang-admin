import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  tagName: 'select',
  classNames: ['form-control'],
  //attribute
  attributeBindings: ['size', 'name', 'style', 'multiple', 'value'],
  size: 5,
  name: 'select',
  multiple: false,
  options: [],
  ref: null,

  init() {
    this._super();
    this.addObserver('value', this, this.valueChanged);
  },

  valueChanged() {
  },

  didInsertElement() {
    this._super();
  },

  getSelectedIndex() {
    return this.$("option:selected").index();
  },

  actions: {
    itemSelect(option) {
      this.sendAction('itemSelect', option);
    },

    itemAction(option) {
      this.sendAction('itemAction', option);
    }
  }
});
