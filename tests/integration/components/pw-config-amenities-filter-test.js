import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pw-config-amenities-filter', 'Integration | Component | pw config amenities filter', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pw-config-amenities-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pw-config-amenities-filter}}
      template block text
    {{/pw-config-amenities-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
