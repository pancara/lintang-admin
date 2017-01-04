import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pw-data-select'],
  classNameBindings: ['expanded'],
  data: ['A', 'B', 'C', 'D'],
  expanded: false,
  actions: {

    expand() {
      this.get('dropdownComponent').show();
      //this.toggleProperty('expanded');
      //
      //let btnExpand = this.$('button.btn-expand');
      //let posButton = btnExpand.offset();
      //let hButton = btnExpand.height();
      //let dropdown = this.$('.pw-data-select-dropdown');
      //dropdown.css({
      //  top: posButton.top + hButton,
      //  left: posButton.left
      //});
      //
      //let target = event;
      //console.log(target);
    },

    refresh() {
    },

    selectData(data) {
    }
  }


});
