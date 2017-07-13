'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/group/:category/:groupId/:categoryId', null, {
            getGroup: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addGroup: {
                method: 'PUT',
                params: {},
                timeout: Constant.reqTimeout
            },
            getGroupById: {
                method: 'GET',
                params: {
                    category: 'detail',
                    groupId: '@groupId'
                },
                timeout: Constant.reqTimeout
            },
            modifyGroup: {
                method: 'POST',
                params: {
                    category: 'detail',
                    groupId: '@groupId'
                },
                timeout: Constant.reqTimeout
            },
            deleteRole: {
                method: 'DELETE',
                params: {
                    category: 'role',
                    groupId: '@groupId',
                    categoryId: '@categoryId'
                },
                timeout: Constant.reqTimeout
            },
            addRole: {
                method: 'PUT',
                params: {
                    category: 'role',
                    groupId: '@groupId',
                    categoryId: '@categoryId'
                },
                timeout: Constant.reqTimeout
            },
            getRoles: {
                method: 'GET',
                params: {
                    category: 'role',
                    groupId: '@groupId'
                },
                timeout: Constant.reqTimeout
            }

        });

        return svc;
    };

    return {
        name: 'GroupSvc',
        svc: ['$resource', Service]
    };


});
