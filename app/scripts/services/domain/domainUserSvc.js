'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/domain/:domainId/env/:env/user', null, {
            getUsers: {
                method: 'GET',
                params: {
                    env: '@env',
                    domainId: '@domainId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addUser: {
                method: 'PUT',
                params: {
                    env: '@env',
                    domainId: '@domainId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            editUser: {
                method: 'POST',
                params: {
                    env: '@env',
                    domainId: '@domainId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            deleteUser: {
                method: 'DELETE',
                params: {
                    env: '@env',
                    domainId: '@domainId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'DomainUserSvc',
        svc: ['$resource', Service]
    };
});
