import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pw-customer-filter', 'Integration | Component | pw customer filter', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pw-customer-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pw-customer-filter}}
      template block text
    {{/pw-customer-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
