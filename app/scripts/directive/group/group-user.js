'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, UserSvc, GroupSvc, ngDialog) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/group/group-user.html',
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
                    GroupSvc.getUsers(searchCriteria, function (resp) {
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
                    GroupSvc.deleteUser({ groupId: $scope.id, categoryId: id }, function () {
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
                        title: '移除用户',
                        type: '用户',
                        name: role.name + '(' + role.email + ')',
                        id: role.email
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
        name: 'groupUser',
        directiveFn: ['$location', 'UserSvc', 'GroupSvc', 'ngDialog', fn]
    };
});
