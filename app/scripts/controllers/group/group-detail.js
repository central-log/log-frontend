'use strict';
define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, $routeParams, GroupSvc, ngDialog) {

        $scope.urlGroupId = $routeParams.id;
        $scope.switchTab = function (tab) {
            $scope.currentTab = tab;
            $scope.openAddPermissionTab = false;
        };
        $scope.switchTab('user');

        $scope.showAddPermission = function () {
            $scope.openAddPermissionTab = true;
            $scope.currentTab = 'permission-add';
        };

        GroupSvc.getGroupById({
            groupId: $routeParams.id
        }, function (resp) {
            $scope.role = resp;
            $scope.loadingDetailStatus = '';
            if (!resp.id) {
                $scope.roleNotFound = true;
            }
        }, function () {
            $scope.role = null;
            $scope.serverError = true;
        });

        $scope.status = [{
            'name': '已禁用',
            'value': 0
        }, {
            'name': '正常',
            'value': 1
        }];
        $scope.modifyRole = function () {
            $scope.submiting = true;
            $scope.newRole.enabled = $scope.newRole.enabledOption.value;
            GroupSvc.modifyGroup($scope.newRole, function (resp) {
                $scope.submiting = false;
                $scope.role.name = resp.name;
                $scope.role.description = resp.description;
                $scope.role.updatedTime = resp.updatedTime;
                $scope.role.enabled = resp.enabled;
                $scope.instanceDialog.close();
            }, function (error) {
                $scope.submiting = false;
                var resp = (error && error.data) || {};

                $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.operateError;
            });
        };

        $scope.submitDisable = function () {
            if (!$scope.newRole.name || !$scope.newRole.description) {
                return true;
            }
            if ($scope.submiting) {
                return true;
            }
            return false;
        };

        $scope.openModifyDialog = function () {
            $scope.submitErrorMsg = '';
            $scope.newRole = {
                groupId: $routeParams.id,
                name: $scope.role.name,
                description: $scope.role.description,
                enabled: $scope.role.enabled,
                enabledOption: $scope.status[$scope.role.enabled]
            };
            $scope.instanceDialog = ngDialog.open({
                template: './views/group/group-modify.html',
                className: 'ngdialog-custom-default',
                scope: $scope
            });
        };

    };

    return {
        name: 'GroupDetailController',
        fn: ['$scope', '$routeParams', 'GroupSvc', 'ngDialog', Controller]
    };


});
