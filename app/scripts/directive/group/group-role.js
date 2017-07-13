'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, GroupSvc, ngDialog) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/group/group-role.html',
            link: function ($scope) {

                $scope.lastCritria = null;
                $scope.queryRole = function () {
                    var searchCriteria = {
                        groupId: $scope.id
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.roles = [];
                    GroupSvc.getRoles(searchCriteria, function (resp) {
                        $scope.loadingStatus = '';
                        $scope.roles = resp;

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
                    GroupSvc.deleteRole({ groupId: $scope.id, categoryId: id }, function () {
                        $scope.submiting = false;
                        $scope.deleteInstanceDialog.close();
                        $scope.queryRole();
                    }, function (error) {
                        $scope.submiting = false;
                        var resp = (error && error.data) || {};

                        $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.operateError;
                    });
                };

                $scope.openDeleteDialog = function (role) {
                    $scope.submitErrorMsg = '';
                    $scope.selectedObject = {
                        title: '移除角色',
                        type: '角色',
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
                        $scope.queryRole();
                    }
                });
            }
        };
    }

    return {
        name: 'groupRole',
        directiveFn: ['$location', 'GroupSvc', 'ngDialog', fn]
    };
});
