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
        var svc = $resource(Constant.apiBase + '/common/:area/:place', null, {
      //  /common/{city}/districts
      //  /common/provinces
      //  /common/{province}/cities
      /*
         /domain
      */
            getCurrentUser: {
                method: 'GET',
                params: {
                    area: 'currentuser'
                },
        // isArray: true,
                timeout: Constant.reqTimeout
            },
            getDomains: {
                method: 'GET',
                params: {
                    area: 'domains'
                },
        // isArray: true,
                timeout: Constant.reqTimeout
            },
            getGroupTypes: {
                method: 'GET',
                params: {
                    area: 'groupTypes'
                },
        // isArray: true,
                timeout: Constant.reqTimeout
            },
            getProvince: {
                method: 'GET',
                params: {
                    area: 'provinces'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getCity: {
                method: 'GET',
                params: {
                    area: '@area',
                    place: 'cities'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getDistrict: {
                method: 'GET',
                params: {
                    area: '@area',
                    place: 'districts'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'CommonSvc',
        svc: ['$resource', Service]
    };


});
