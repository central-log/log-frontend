
require(['drApp',
    'services/domain/domainSvc',
    'services/user/userSvc',
    'services/common/commonSvc',
    'services/common/common',
    'services/role/roleSvc',
    'services/group/groupSvc',
    'services/menu/menuSvc',
    'services/menu/uriSvc',
    'modules/templates',
    'controllers/nogin',
    'controllers/role/role',
    'controllers/role/role-detail',
    'controllers/role/role-menu',
    'controllers/role/role-url',
    'controllers/role/role-user',
    'controllers/domain/domain',
    'controllers/domain/domain-my',
    'controllers/domain/domain-detail',
    'controllers/domain/domain-info',
    'controllers/domain/domain-info-edit',
    'controllers/domain/domain-edit',
    'controllers/domain/domain-mapping',
    'controllers/domain/domain-management',
    'controllers/user/user',
    'controllers/user/user-detail',
    'controllers/group/group',
    'controllers/group/group-detail',
    'services/login/loginSvc',
    'services/login/logoutSvc',
    'services/login/accountSvc',
    'controllers/acount',
    'directive/location',
    'directive/dropdown',
    'directive/dialog',
    'services/common/httpInterceptorSvc'
  ],
  function (app) {
    var components = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = components.length; i < len; i++) {

      if (components[i].svc) {
        // Register Factory
        app.factory(components[i].name, components[i].svc);
      } else if (components[i].fn) {
        // Register Controllder
        app.controller(components[i].name, components[i].fn);
      } else if (components[i].directiveFn) {
        app.directive(components[i].name, components[i].directiveFn);
      }
    }
    app.bootstrap();
    return app;
  });
