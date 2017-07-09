'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
    /*
      Get     /user/:id
      Put     /user/:id/user/:ids
      delete  /user/:id/user/:id
      Get     /user/:id/menu
      Get     /user/:id/url
     */
        var svc = $resource(Constant.apiBase + '/menu/:catalog', null, {

            queryMenu: {
                method: 'POST',
                params: {
                    catalog: 'query'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getDistrictByProId: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: true,
                timeout: Constant.reqTimeout
            },
            getCityByDistrictId: {
                method: 'GET',
                params: {
                    id: '@id',
                    catalog: '@district'
                },
                isArray: true,
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'MenuSvc',
        svc: ['$resource', Service]
    };


});
