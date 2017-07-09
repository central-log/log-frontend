'use strict';
define(['utils/Constant'], function (Constant) {

    var DomainController = function ($scope, DomainSvc) {
        $scope.domains = [{
            id: '001',
            name: 'User Management System',
            desc: 'Permission Control',
            licenceTime: '2018-10-12 02:00:00'
        }];
    };

    return {
        name: 'DomainMyController',
        fn: ['$scope', 'DomainSvc', DomainController]
    };


});
