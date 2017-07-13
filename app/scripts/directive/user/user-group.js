'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, UserSvc, GroupSvc, ngDialog) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/user/user-group.html',
            link: function ($scope) {

                $scope.pagination = {
                    pageSize: Constant.pageSize,
                    curPage: 1,
                    totalCount: 0
                };

                $scope.lastCritria = null;
                $scope.onsearch = function () {
                    var searchCriteria = {
                        groupId: $scope.id,
                        pageSize: $scope.pagination.pageSize,
                        page: $scope.pagination.curPage
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.roles = [];
                    UserSvc.getGroups(searchCriteria, function (resp) {
                        $scope.loadingStatus = '';
                        $scope.roles = resp;

                        $scope.pagination.curPage = resp.page;
                        $scope.pagination.totalCount = resp.totalCount;
                        $scope.pagination.pageSize = resp.pageSize;

                        if (!resp || !resp.length) {
                            $scope.roles = [];
                            $scope.loadingStatus = Constant.loadEmpty;
                        }

                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
                    });
                };

                $scope.deleteObject = function (id) {
                    $scope.submiting = true;
                    GroupSvc.deleteUser({ groupId: id, categoryId: $scope.id }, function () {
                        $scope.submiting = false;
                        $scope.deleteInstanceDialog.close();
                        $scope.onsearch();
                    }, function (error) {
                        $scope.submiting = false;
                        var resp = (error && error.data) || {};

                        $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.operateError;
                    });
                };

                $scope.openDeleteDialog = function (role) {
                    $scope.submitErrorMsg = '';
                    $scope.selectedObject = {
                        title: '移除组',
                        type: '组',
                        name: role.name,
                        id: role.id
                    };
                    $scope.deleteInstanceDialog = ngDialog.open({
                        template: './views/directive/user/role-confirm-delete.html',
                        className: 'ngdialog-custom-default',
                        scope: $scope
                    });
                };

                $scope.$watch('id', function () {
                    if ($scope.id) {
                        $scope.onsearch();
                    }
                });

            }
        };
    }

    return {
        name: 'userGroup',
        directiveFn: ['$location', 'UserSvc', 'GroupSvc', 'ngDialog', fn]
    };
});
