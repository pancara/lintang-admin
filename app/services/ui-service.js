import Ember from 'ember';
import Constant from '../utils/constants';

export default Ember.Service.extend({
  messageBoxes: [],

  isSmallScreen() {
    var query = '(max-width:' + Constant.SCREEN.PHONE.WIDTH + 'px)';
    return window.matchMedia(query).matches;
  },

  applyNiceScroll(target) {
    let $el = Ember.$(target);

    if ($el.getNiceScroll().length !== 0) {
      return;
    }

    $el.niceScroll({
      cursorcolor: "#AAA",
      cursoropacitymin: 0,
      cursoropacitymax: 1,
      cursorwidth: "5px",
      cursorborder: "0px solid #fff",
      cursorborderradius: "2px",
      zindex: 99999
    });
  },

  transitionEventCallback() {
    var t,
      el = document.createElement("fakeelement");

    var transitions = {
      "transition": "transitionend",
      "OTransition": "oTransitionEnd",
      "MozTransition": "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },

  confirm(prompt) {
    let result = window.confirm(prompt);
    return result;
  },

  showMessage(message, pTimeout, type) {

    var messageBoxes = this.get('messageBoxes');

    // calc new message box position
    var top = 0;
    for (let m of messageBoxes) {
      top += Ember.$(m).outerHeight() + 2;
    }


    let msgBox = Ember.$('<div class="pw-message"><span>' + message + '</span></div>');

    if (type === 'success') {
      msgBox.addClass('pw-message-success');
    } else if (type === 'error') {
      msgBox.addClass('pw-message-error');
    } else if (type === 'warning') {
      msgBox.addClass('pw-message-warning');
    }

    Ember.$('body').append(msgBox);
    msgBox.css({
      top: top
    });
    messageBoxes.push(msgBox);

    let timeout = pTimeout ? pTimeout : 5000;

    Ember.run.later(this, function () {
      let newMessageBoxes = messageBoxes.filter(e => e !== msgBox);
      this.set('messageBoxes', newMessageBoxes);
      Ember.$(msgBox).fadeOut(500, function () {
        msgBox.remove();
      });
    }, timeout);
  }

});
