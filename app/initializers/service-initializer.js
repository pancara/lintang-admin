export function initialize(application) {
  application.inject('component:pw-sidebar', 'ui-service', 'service:ui-service', {singleton: true});
  //application.inject('component:pw-select', 'ui-service', 'service:ui-service', {singleton: true});
  application.inject('component:pw-iconmenu', 'ui-service', 'service:ui-service', {singleton: true});
  //
  application.inject('component:pw-progress-indicator', 'request-sender',
    'service:request-sender', {singleton: true});

  application.inject('route', 'ui-service', 'service:ui-service', {singleton: true});
  application.inject('route', 'datastub', 'service:datastub', {singleton: true});
  //application.inject('route', 'security-service', 'service:security-service', {singleton: true});
  application.inject('route', 'request-sender', 'service:request-sender', {singleton: true});

  application.inject('controller', 'datastub', 'service:datastub', {singleton: true});
  application.inject('controller', 'user-service', 'service:user-service', {singleton: true});
  application.inject('controller', 'storage-service', 'service:storage-service', {singleton: true});
  application.inject('controller', 'request-sender', 'service:request-sender', {singleton: true});
  application.inject('controller', 'crypt-service', 'service:crypt-service', {singleton: true});
  //application.inject('controller', 'security-service', 'service:security-service', {singleton: true});
  application.inject('controller', 'ui-service', 'service:ui-service', {singleton: true});

  // service
}

export default {
  name: 'service-initializer',
  initialize
};
