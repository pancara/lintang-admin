import Ember from 'ember';

export default Ember.Service.extend({
  uiService: Ember.inject.service('ui-service'),
  baseUrl: 'http://dev.lintang.id/api/',
  requestCount: 0,

  getFullURL(url) {
    return this.get('baseUrl') + url;
  },

  ajaxGet(url, data, header) {
    return this.ajax(url, 'get', data, header);
  },

  ajaxPost(url, data, header) {
    return this.ajax(url, 'post', data, header);
  },

  ajaxPut(url, data, header) {
    return this.ajax(url, 'put', data, header);
  },

  ajaxDelete(url, data, header) {
    return this.ajax(url, 'delete', data, header);
  },

  ajax(url, method, data, header) {
    this.incrementProperty('requestCount');
    var that = this;
    var fullURL = this.getFullURL(url);

    var promise = new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax(fullURL, {
        method: method,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: header,

        success(response) {
          resolve(response);
        },

        error(xhr, textStatus, error) {
          var reason = {
            xhr: xhr,
            text: textStatus,
            error: error
          };
          if (xhr.status === 401) {
            that.get('uiService').showMessage('Invalid Token. Please, refresh the access token.');
          }
          reject(reason);
        },

        complete() {
          Ember.run.later(function () {
            var requestCount = that.get('requestCount');
            if (requestCount > 0) {
              that.decrementProperty('requestCount');
            }
          }, 200);
        }
      });
    });

    return promise;
  }
});
