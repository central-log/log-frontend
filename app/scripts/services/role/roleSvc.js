'use strict';
/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */
  var Service = function ($resource) {

    var svc = $resource(Constant.apiBase + '/role/:roleId/:catalog/:catalogId', null, {

      getRoles: {
        method: 'POST',
        params: {
          roleId: 'query'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },

      getRoleById: {
        method: 'GET',
        params: {
          roleId: '@roleId'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      addRole: {
        method: 'POST',
        params: {},
        timeout: Constant.reqTimeout
      },
      modifyRole: {
        method: 'POST',
        params: {
          roleId: 'update'
        },
        timeout: Constant.reqTimeout
      },
      /*
         /domain/:domainId/user
      */
      getRoleMenus: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'menu'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      },
      /*
         /domain/:domainId/user/:userIds
      */
      addRoleMenus: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'menu'
        },
        timeout: Constant.reqTimeout
      },

      removeRoleMenus: {
        method: 'DELETE',
        params: {
          roleId: '@roleId',
          catalog: 'menu'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      /*
        Get     URL
      */
      getRoleURLs: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'url'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      },
      addRoleURLs: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'uri'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },

      removeRoleURLs: {
        method: 'DELETE',
        params: {
          roleId: '@roleId',
          catalog: 'uri'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      // User
      getRoleUsers: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'user'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      },
      addRoleUsers: {
        method: 'GET',
        params: {
          roleId: '@roleId',
          catalog: 'user'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },

      removeRoleUsers: {
        method: 'DELETE',
        params: {
          roleId: '@roleId',
          catalog: 'user'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      }
    });
    return svc;
  };

  return {
    name: "RoleSvc",
    svc: ["$resource", Service]
  };


});
