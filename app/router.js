import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('login');
  this.route('forget-password');
  this.route('forget-password-reset');

  this.route('main', function () {
    this.route('change-password');
    this.route('operator', function () {
      this.route('form');
      this.route('fee');
      this.route('status');
    });


    this.route('user-profile');

    this.route('customer', function () {
      this.route('form');
    });

    this.route('booking', function () {
    });

    this.route('config-default', function () {
      this.route('form');
    });


    this.route('config-airport-fee-landing', function () {
      this.route('form');
    });

    this.route('config-airport-fee-parking', function () {
      this.route('form');
    });

    this.route('config-amenities', function () {
      this.route('form');
    });

    this.route('config-pricing', function () {
      this.route('form');
    });

    this.route('operator-user', function () {
      this.route('add-user');
      this.route('update-profile');
      this.route('update-role');
    });

    this.route('aircraft', function () {
      this.route('aircraft-form');
      this.route('availability');
      this.route('special-price');
      this.route('amenities');
      this.route('images');
    });


  });
  this.route('logout');
  this.route('help');
  this.route('demo');
});

export default Router;
