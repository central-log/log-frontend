'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/group/:category/:groupId', null, {
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
            modifyRole: {
                method: 'POST',
                params: {
                    category: 'detail',
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
