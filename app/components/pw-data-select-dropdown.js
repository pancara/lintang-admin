import Ember from 'ember';
import RegisterAsComponent from '../mixins/register-as-component';

export default Ember.Component.extend(RegisterAsComponent, {
  classNames: ['pw-data-select-dropdown'],
  classNameBindings: ['dropdownShown'],
  attributeBindings: ['tabIndex'],

  dropdownShown: false,
  tabIndex: 0,
  data: ['A', 'B', 'C', 'D'],
  expanded: false,

  close() {
    this.set('dropdownShown', false);
  },

  show() {
    this.set('dropdownShown', true);
  },

  actions: {
    close() {
      this.set('dropdownShown', false);
    },

    expand(evt) {
      this.toggleProperty('expanded');

      let btnExpand = this.$('button.btn-expand');
      let posButton = btnExpand.offset();
      let hButton = btnExpand.height();
      let dropdown = this.$('.pw-data-select-dropdown');
      dropdown.css({
        top: posButton.top + hButton,
        left: posButton.left
      });

      let target = event;
    },

    refresh() {
    },

    selectData(data) {
    }
  }


});
