'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/group', null, {
            getGroup: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addGroup: {
                method: 'PUT',
                params: {},
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
