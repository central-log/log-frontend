'use strict';
/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */
  var Service = function ($resource) {
    /* 
      Get     /domain/:domainId
      Put     /domain/:domainId/user/:userIds
      delete  /domain/:domainId/user/:userId
      Get     /domain/:domainId/menu
      Get     /domain/:domainId/url
     */
    //var svc = $resource(Constant.apiBase + '/domain/:domainId/:catalog/:catalogId', null, {
    var svc = $resource(Constant.apiBase + '/common/:catalog/', null, {
      /*
         /domain/:domainId
      */
      modifyPwd: {
        method: 'POST',
        params: {
          catalog: 'modifyPwd',
        },
        //isArray: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        transformRequest: function (data) {
          var str = [];
          for (var d in data) {
            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
          }
          return str.join("&");
        },
        timeout: Constant.reqTimeout,
        interceptor: {
          response: function (response) {
            var result = response.resource;
            result.$status = response.status;
            return result;
          }
        }
      }
    });
    return svc;
  };

  return {
    name: "AccountSvc",
    svc: ["$resource", Service]
  };


});
