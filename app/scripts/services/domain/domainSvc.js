
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
    var svc = $resource(Constant.apiBase + '/domain/:domainId/:catalog/:catalogId', null, {

      queryDomain: {
        method: 'GET',
        isArray: false,
        timeout: Constant.reqTimeout
      },
      modifyEnvDomain:{
        method: 'PUT',
        params: {
          domainId: '@domainId',
          catalog: 'env'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      addEnvDomain: {
        method: 'POST',
        params: {
          domainId: '@domainId',
          catalog: 'env'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      addDomain: {
        method: 'PUT',
        isArray: false,
        timeout: Constant.reqTimeout
      },
      /*
         /domain/:domainId
      */
      getDomainById: {
        method: 'GET',
        params: {
          domainId: '@domainId'
        },

        timeout: Constant.reqTimeout
      },
      /*
         /domain/:domainId/user
      */
      getDomainUsers: {
        method: 'GET',
        params: {
          domainId: '@domainId',
          catalog: 'user'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      },
      /*
         /domain/:domainId/user/:userIds
      */
      addDomainUsers: {
        method: 'GET',
        params: {
          domainId: '@domainId',
          catalog: 'user',
          userIds: '@userIds'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      /*
        /domain/:domainId/user/:userId
      */
      removeDomainUsers: {
        method: 'DELETE',
        params: {
          domainId: '@domainId',
          catalog: 'user'
        },
        isArray: false,
        timeout: Constant.reqTimeout
      },
      /*
        Get     /domain/:domainId/menu
      */
      getDomainMenus: {
        method: 'GET',
        params: {
          domainId: '@domainId',
          catalog: 'menu'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      },
      /*
        Get     /domain/:domainId/url
      */
      getDomainUrls: {
        method: 'GET',
        params: {
          domainId: '@domainId',
          catalog: 'url'
        },
        isArray: true,
        timeout: Constant.reqTimeout
      }
    });
    return svc;
  };

  return {
    name: "DomainSvc",
    svc: ["$resource", Service]
  };


});
