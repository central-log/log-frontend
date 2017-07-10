'use strict';
define(function () {
    var userSelectedTabKey = 'user-detail-selected';
    var Controller = function ($scope, $window, $routeParams, $filter, UserSvc, GroupSvc, RoleSvc, $location, localStorageService) {

        $scope.userParamEmail = $routeParams.id;

        $scope.switchTab = function (tab) {
            $scope.currentTab = tab;
            localStorageService.set(userSelectedTabKey, tab);
        };

        var selectedTabName = localStorageService.get(userSelectedTabKey);

        if (selectedTabName && selectedTabName !== 'null' && selectedTabName !== 'undefined' && selectedTabName.indexOf('add') !== 0) {
            $scope.switchTab(selectedTabName);
        } else {
            $scope.switchTab('permission');
        }

        // user detail
        if ($routeParams.id) {
            UserSvc.getUserById({
                userId: $routeParams.id
            }, function (res) {
                $scope.userDetail = res;
            }, function () {
                $scope.userDetail = {};
            });
        }

    };

    return {
        name: 'UserDetailController',
        fn: ['$scope', '$window', '$routeParams', '$filter', 'UserSvc', 'GroupSvc', 'RoleSvc', '$location', 'localStorageService', Controller]
    };


});
