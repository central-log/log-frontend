'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {

        var svc = $resource(Constant.apiBase + '/permission', null, {

            getAllPermission: {
                method: 'GET',
                isArray: true,
                timeout: Constant.reqTimeout
            }

        });

        return svc;
    };

    return {
        name: 'PermissionSvc',
        svc: ['$resource', Service]
    };


});
