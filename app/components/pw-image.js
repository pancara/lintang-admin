import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'style'],
  default: null,
  source: null,
  basePath: Constant.HOST_URL,

  src: Ember.computed('default', 'source', function () {
    let source = this.get('source');
    return (!source || 0 === source.length) ? this.get('default') : this.get('basePath') + source;
  })
});
