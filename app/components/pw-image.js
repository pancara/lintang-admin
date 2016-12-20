import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'style'],
  default: null,
  source: null,
  basePath: 'http://dev.lintang.id/',

  src: Ember.computed('default', 'source', function () {
    let source = this.get('source');
    return (!source || 0 === source.length) ? this.get('default') : Constant.SERVER_URL + source;
  })
});
