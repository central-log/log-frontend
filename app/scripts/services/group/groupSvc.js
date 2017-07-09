'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
    /*
      Get     /group/:groupId
      Put     /group/:groupId/user/:userIds
      delete  /group/:groupId/user/:userId
      Get     /group/:groupId/menu
      Get     /group/:groupId/url
     */
        var svc = $resource(Constant.apiBase + '/group/:method/:groupId/:user', null, {
      /*
         /group
      */
            getGroups: {
                method: 'POST',
                params: {
                    method: 'query'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addGroup: {
                method: 'POST',
                params: {
                    method: 'create'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addSubGroup: {
                method: 'POST',
                params: {
                    method: 'create'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
      /*
         /group/:groupId/info
      */
            getGroupById: {
                method: 'GET',
                params: {
                    groupId: '@groupId'
                },
                timeout: Constant.reqTimeout
            },
            modifyGroup: {
                method: 'POST',
                params: {
                    method: 'update'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
      /*
         /group/:groupId/user
      */
      /*
         /group/:groupId/user/:userIds
      */
            addgroupUsers: {
                method: 'PUT',
                params: {
                    groupId: '@groupId',
                    user: 'user'
                },
                isArray: false,
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
