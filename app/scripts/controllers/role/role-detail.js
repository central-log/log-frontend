'use strict';
define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, $routeParams, RoleSvc) {

        $scope.switchTab = function (tab) {
            $scope.currentTab = tab;
            $scope.openAddPermissionTab = false;
        };
        $scope.switchTab('permission');

        $scope.showAddPermission = function () {
            $scope.openAddPermissionTab = true;
            $scope.currentTab = 'permission-add';
        };

        RoleSvc.getRoleById({
            roleId: $routeParams.roleId
        }, function (resp) {
            $scope.role = resp;
            $scope.loadingDetailStatus = '';
        }, function () {
            $scope.loadingDetailStatus = Constant.loadError;
            $scope.role = null;
        });

    };

    return {
        name: 'RoleDetailController',
        fn: ['$scope', '$routeParams', 'RoleSvc', Controller]
    };


});
