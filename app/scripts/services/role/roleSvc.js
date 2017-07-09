'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {

        var svc = $resource(Constant.apiBase + '/role/:catalog/:roleId/:catalogId', null, {

            getRoles: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },

            getRoleById: {
                method: 'GET',
                params: {
                    roleId: '@roleId',
                    catalog: 'detail'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addRole: {
                method: 'PUT',
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
            getRolePermission: {
                method: 'GET',
                params: {
                    catalogId: 'permission',
                    roleId: '@roleId'
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
        name: 'RoleSvc',
        svc: ['$resource', Service]
    };


});
