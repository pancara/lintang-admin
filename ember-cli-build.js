/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
      enabled: false,
      exclude: ['images/aircraft', 'images/mock']
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import(app.bowerDirectory + '/jquery.nicescroll/dist/jquery.nicescroll.min.js');
  app.import(app.bowerDirectory + '/jquery.easing/js/jquery.easing.compatibility.js');

  app.import(app.bowerDirectory + '/bootstrap-datepicker/dist/js/bootstrap-datepicker.js');
  app.import(app.bowerDirectory + '/pw-bootstrap-timepicker/js/bootstrap-timepicker.js');
  app.import(app.bowerDirectory + '/js-sha256/build/sha256.min.js');
  app.import(app.bowerDirectory + '/crypto-js/crypto-js.js');

  app.import(app.bowerDirectory + '/popconfirm/jquery.popconfirm.js');

  return app.toTree();
};
