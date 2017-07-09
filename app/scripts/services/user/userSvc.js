'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/user/:userId', null, {
            getUsers: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addUser: {
                method: 'PUT',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            editUser: {
                method: 'POST',
                params: {
                    userId: '@userId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            deleteUser: {
                method: 'DELETE',
                params: {
                    userId: '@userId'
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
