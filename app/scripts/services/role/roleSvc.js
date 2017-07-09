'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {

        var svc = $resource(Constant.apiBase + '/role/:catalog/:roleId/:permissionId', null, {

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

            getRolePermission: {
                method: 'GET',
                params: {
                    catalog: 'permission',
                    roleId: '@roleId'
                },
                isArray: true,
                timeout: Constant.reqTimeout
            },
            addPermission: {
                method: 'PUT',
                params: {
                    catalog: 'permission',
                    roleId: '@roleId'
                },
                isArray: true,
                timeout: Constant.reqTimeout
            },
            deletePermission: {
                method: 'DELETE',
                params: {
                    catalog: 'permission',
                    roleId: '@roleId',
                    permissionId: '@permissionId'
                },
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
