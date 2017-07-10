'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/user/:category/:userId/:categoryId', null, {
            getUsers: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getUserById: {
                method: 'GET',
                params: {
                    userId: '@userId',
                    category: 'detail'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getRoleOfUser: {
                method: 'GET',
                params: {
                    userId: '@userId',
                    category: 'role'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            deleteRole: {
                method: 'DELETE',
                params: {
                    userId: '@userId',
                    categoryId: '@categoryId',
                    category: 'role'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addRole: {
                method: 'PUT',
                params: {
                    userId: '@userId',
                    categoryId: '@categoryId',
                    category: 'role'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'UserSvc',
        svc: ['$resource', Service]
    };
});
