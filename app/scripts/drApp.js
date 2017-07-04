
/**
 * A module representing a shirt.
 * @exports drApp
 */
define('drApp', ['angular', 'ngResource', 'ngRoute', 'ngCookies', 'ngDialog', 'ngDatePicker',
    'controllers/MainController', 'directive/directive', 'angular.ui.bootstrap', 'ngLocalStorage'
],
  function (angular, ngResource, ngRoute, ngCookies, ngDialog, ngDatePicker, mainController, directive) {
      var appName = 'DRApp';
      var app = angular.module(appName, ['ngResource', 'ngRoute', 'ngCookies', 'ngDialog', 'ui.bootstrap', 'LocalStorageModule', '720kb.datepicker']);

      app.controller(mainController.name, mainController.fn);
      app.directive(directive.name, directive.fn);
      app.bootstrap = function () {
          angular.bootstrap(document, [appName]);
      };
      app.run(['$cookies', '$location', '$rootScope', function ($cookies, $location, $rootScope) {

          $rootScope.$on('$routeChangeSuccess', function (event, routeData) {
              $rootScope.pageTitle = (routeData.helpAlias ? routeData.helpAlias : '首页') + '－日志集成管理系统';

              if (!$rootScope.getCookieUsername() && $location.path().indexOf('/login') !== 0) {
          // $location.url('/login');
              }
          });

          app.config(['ngDialogProvider', function (ngDialogProvider) {
              ngDialogProvider.setDefaults({
              // className: 'ngdialog-custom-default',
                  showClose: false,
                  closeByEscape: true
              });
          }]);

      }]);

      app.config(['$routeProvider', 'localStorageServiceProvider', '$httpProvider',
          function ($routeProvider, localStorageServiceProvider, $httpProvider) {

        // $httpProvider.defaults.xsrfCookieName = 'tk';
              $httpProvider.defaults.useXDomain = true;
              $httpProvider.defaults.withCredentials = true;
        // delete $httpProvider.defaults.headers.common["X-Requested-With"];
              $httpProvider.interceptors.push('httpInterceptorSvc');

              localStorageServiceProvider.prefix = 'DR-TechOps' + window.location.hostname;
              $routeProvider
        .when('/user', {
            templateUrl: 'views/user/user.html',
            controller: 'UserController',
            helpAlias: '用户管理'
        })
        .when('/user/add', {
            templateUrl: 'views/user/user-add.html',
            controller: 'UserController',
            helpAlias: '新增用户'
        })
        .when('/user/:id', {
            templateUrl: 'views/user/user-detail.html',
            controller: 'UserDetailController',
            helpAlias: '用户详情'
        })
        .when('/user/:id/modify', {
            templateUrl: 'views/user/user-modify.html',
            controller: 'UserDetailController',
            helpAlias: '用户修改'
        })
        .when('/user/:id/role/add', {
            templateUrl: 'views/user/user-role-management.html',
            controller: 'UserDetailController',
            helpAlias: '用户详情-添加角色'
        })
        .when('/group', {
            templateUrl: 'views/group/group.html',
            controller: 'GroupController',
            helpAlias: '组管理'
        })
        .when('/group/add', {
            templateUrl: 'views/group/group-add.html',
            controller: 'GroupController',
            helpAlias: '新增组'
        })
        .when('/group/:id', {
            templateUrl: 'views/group/group-detail.html',
            controller: 'GroupDetailController',
            helpAlias: '组详情'
        })
        .when('/group/:id/modify', {
            templateUrl: 'views/group/group-modify.html',
            controller: 'GroupDetailController',
            helpAlias: '组修改'
        })
        .when('/group/:id/add-sub', {
            templateUrl: 'views/group/group-add-sub.html',
            controller: 'GroupDetailController',
            helpAlias: '新增子组'
        })
        .when('/domain', {
            templateUrl: 'views/domain/domain.html',
            controller: 'DomainController',
            helpAlias: '我的应用'
        })
        .when('/domain/info/:id', {
            templateUrl: 'views/domain/domain-info.html',
            controller: 'DomainInfoController',
            helpAlias: '域管理'
        })
        .when('/domain/info/:id/edit', {
            templateUrl: 'views/domain/domain-info-edit.html',
            controller: 'DomainInfoEditController',
            helpAlias: '域管理'
        })
        .when('/domain/edit/:id', {
            templateUrl: 'views/domain/domain-edit.html',
            controller: 'DomainEditController',
            helpAlias: '域管理'
        })
        // .when('/domain/my', {
        //   templateUrl: 'views/domain/domain-my.html',
        //   controller: 'DomainMyController',
        //   helpAlias: '我的应用'
        // })
        // .when('/domain/my/:domainId', {
        //   templateUrl: 'views/domain/domain-details.html',
        //   controller: 'DomainMyDetailController',
        //   helpAlias: '我的应用'
        // })
        // .when('/domain/mapping', {
        //   templateUrl: 'views/domain/domain-mapping.html',
        //   controller: 'DomainMappingController',
        //   helpAlias: '域管理'
        // })
        .when('/domain/:domainId', {
            templateUrl: 'views/domain/domain-details.html',
            controller: 'DomainDetailController',
            helpAlias: '域详情'
        })
        // .when('/domain/:domainId/management', {
        //   templateUrl: 'views/domain/domain-management.html',
        //   controller: 'UserBindManagementController',
        //   helpAlias: '域详情-添加用户'
        // })
        .when('/role', {
            templateUrl: 'views/role/role.html',
            controller: 'RoleController',
            helpAlias: '角色管理'
        })
        .when('/role/add', {
            templateUrl: 'views/role/role-add.html',
            controller: 'RoleController',
            helpAlias: '角色添加'
        })
        .when('/role/:roleId', {
            templateUrl: 'views/role/role-details.html',
            controller: 'RoleDetailController',
            helpAlias: '角色详情'
        })
        .when('/role/:roleId/modify', {
            templateUrl: 'views/role/role-modify.html',
            controller: 'RoleDetailController',
            helpAlias: '角色修改'
        })
        .when('/role/:roleId/menu-management', {
            templateUrl: 'views/role/role-menu-management.html',
            controller: 'RoleMenuController',
            helpAlias: '角色-添加菜单'
        })
        .when('/role/:roleId/url-management', {
            templateUrl: 'views/role/role-url-management.html',
            controller: 'RoleURLController',
            helpAlias: '角色-添加URL模式'
        })
        .when('/role/:roleId/user-management', {
            templateUrl: 'views/role/role-user-management.html',
            controller: 'UserBindManagementController',
            helpAlias: '角色-添加用户'
        })

        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginController',
            helpAlias: '登录'
        }).when('/login/resetPwd', {
            templateUrl: 'views/login/reset-pwd.html',
            controller: 'LoginController',
            helpAlias: '重置密码'
        }).when('/account', {
            templateUrl: 'views/login/modify-pwd.html',
            controller: 'AccountController',
            helpAlias: '设置-修改密码'
        }).when('/404', {
            templateUrl: 'views/common/404.html',
            controller: '',
            helpAlias: '404'
        }).when('/403', {
            templateUrl: 'views/common/403.html',
            controller: '',
            helpAlias: '403'
        }).when('/', {
            templateUrl: 'views/domain/domain.html',
            controller: 'DomainController',
            helpAlias: '域管理'
        }).otherwise({
            redirectTo: '/404'
        });
          }
      ]);
      return app;
  });
