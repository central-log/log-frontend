'use strict';
define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, $routeParams, RoleSvc, UserSvc) {
        $scope.criteria = {};
        $scope.roleId = $routeParams.roleId;

        var dt = new Date();

        $scope.defaultHolder = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        $scope.onsearch = function () {
            $scope.bindList = [];
            $scope.searchRslt = [];
            $scope.loadingStatus = Constant.loading;

            UserSvc.getUsers($scope.criteria, function (users) {
                $scope.searchRslt = users.list.map(function (user) {
                    user.selected = false;
                    return user;
                });
            });
        };

        $scope.bindList = [];
        $scope.toggleAll = function (selectAll) {
            if (!selectAll) {
                $scope.searchRslt.map(function (d) {
                    d.selected = true;
                    return d;
                });
                $scope.bindList = $scope.searchRslt.map(function (d) {
                    return d.id;
                });
            } else {
                $scope.searchRslt.map(function (d) {
                    d.selected = false;
                    return d;
                });
                $scope.bindList = [];
            }
        };
        $scope.toggle = function (menu) {
            menu.selected = !menu.selected;
            var i, len = $scope.bindList.length;

            for (i = 0; i < len; i++) {
                if ($scope.bindList[i] === menu.id) {
                    $scope.bindList.splice(i, 1);
                    break;
                }
            }
            if (i === len) {
                $scope.bindList.push(menu.id);
            }
            $scope.selectAll = ($scope.bindList.length === $scope.searchRslt.length);
        };
        $scope.bindRole = function () {
            $scope.bindResult = '';
            if (!$scope.bindList.length) {
                return;
            }
            RoleSvc.addRoleUsers({
                roleId: $scope.roleId,
                userIds: $scope.bindList.join(',')
            }, function () {
                $scope.bindResult = 'success';
            }, function () {
                $scope.bindResult = 'failed';
            });
        };
    };

    return {
        name: 'RoleUserController',
        fn: ['$scope', '$routeParams', 'RoleSvc', 'UserSvc', Controller]
    };

});
