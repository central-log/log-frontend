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

  var DomainController = function ($scope, DomainSvc) {
    $scope.domains = [{
      id: '001',
      name: 'User Management System',
      desc: 'Permission Control',
      licenceTime: '2018-10-12 02:00:00'
    }]
  };

  return {
    name: "DomainMyController",
    fn: ["$scope", "DomainSvc", DomainController]
  };


});
