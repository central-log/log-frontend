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
        var svc = $resource(Constant.apiBase + '/uri/:catalog', null, {

            queryURI: {
                method: 'POST',
                params: {
                    catalog: 'query'
                }
            }
        });

        return svc;
    };

    return {
        name: 'URISvc',
        svc: ['$resource', Service]
    };


});
