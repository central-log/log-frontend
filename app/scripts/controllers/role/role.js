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
    var Controller = function ($scope, RoleSvc, localStorageService, $location, ngDialog) {
        $scope.criteria = {
            name: ''
        };

        $scope.pagination = {
      // pageSize: 2,
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

        $scope.submitText = '创建';
        $scope.submitDisable = function () {
            if (!$scope.newRole.name || !$scope.newRole.description) {
                return true;
            }
            if ($scope.submiting) {
                return true;
            }
            return false;
        };
        $scope.createRole = function () {
            $scope.submitErrorMsg = '';
            if (!$scope.newRole.name || !$scope.newRole.description) {
                return;
            }
            $scope.submiting = true;
            RoleSvc.addRole($scope.newRole, function (resp) {
                $scope.submiting = false;
                var result = Constant.transformResponse(resp);

                if (!result) {
                    $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                    return;
                }
                $scope.submitErrorMsg = '';
        // console.log($scope);
                $scope.roles.unshift(result);
                $scope.loadingStatus = '';
                $scope.addInstanceDialog.close();
        // $location.url('/role/' + result);
            }, function (resp) {
                $scope.submiting = false;
                $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
            });
        };


        $scope.addRoleDialog = function () {
            $scope.submitErrorMsg = '';
            $scope.newRole = {
                enabled: true
            };
            $scope.addInstanceDialog = ngDialog.open({
                template: './views/role/role-add.html',
                className: 'ngdialog-custom-default',
        // controller: 'RoleController'
                scope: $scope
            });
        };
        $scope.lastCritria = null;
        $scope.onsearch = function () {
            var searchCriteria = {
                name: $scope.criteria.name ? $scope.criteria.name : null,
                pageSize: $scope.pagination.pageSize,
                page: $scope.pagination.curPage
            };

            $scope.lastCritria = searchCriteria;
            $scope.loadingStatus = Constant.loading;
            $scope.roles = [];
            RoleSvc.getRoles(searchCriteria, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    $scope.roles = [];
                    return;
                }
        // No Pagination
                if (!result || !result.data || !result.data.length) {
                    $scope.roles = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';
                $scope.roles = result.data;

                $scope.pagination.curPage = result.page;
                $scope.pagination.totalCount = result.totalCount;
                $scope.pagination.pageSize = result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };

        $scope.onsearch();
    };

    return {
        name: 'RoleController',
        fn: ['$scope', 'RoleSvc', 'localStorageService', '$location', 'ngDialog', Controller]
    };

});
