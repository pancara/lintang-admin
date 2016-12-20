import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pw-filter-config-airport-fee', 'Integration | Component | pw filter config airport fee', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pw-filter-config-airport-fee}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pw-filter-config-airport-fee}}
      template block text
    {{/pw-filter-config-airport-fee}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
