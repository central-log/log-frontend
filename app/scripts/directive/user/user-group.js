'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, RoleSvc, ngDialog) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/user/user-group.html',
            link: function ($scope) {

            // Event listeners
                $scope.lastCritria = null;
                $scope.queryUser = function () {
                    var searchCriteria = {
                        roleId: $scope.id
                    };

                    $scope.displayData = {};
                    $scope.types = [];

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.users = [];
                    RoleSvc.getRolePermission(searchCriteria, function (resp) {
                        $scope.loadingStatus = '';
                        $scope.users = resp;

                        if (!resp || !resp.length) {
                            $scope.users = [];
                            $scope.loadingStatus = Constant.loadEmpty;
                        }

                        $scope.users.forEach(function (p) {
                            if (!(p.type in $scope.displayData)) {
                                $scope.displayData[p.type] = [p];
                            } else {
                                $scope.displayData[p.type].push(p);
                            }
                        });
                        $scope.types = Object.keys($scope.displayData);

                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
                    });
                };

                $scope.deletePermission = function (id) {
                    $scope.submiting = true;
                    RoleSvc.deletePermission({ roleId: $scope.id, permissionId: id }, function () {
                        $scope.submiting = false;
                        $scope.deleteInstanceDialog.close();
                        $scope.queryUser();
                    }, function (error) {
                        $scope.submiting = false;
                        var resp = (error && error.data) || {};

                        $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.operateError;
                    });
                };

                $scope.openDeleteDialog = function (p) {
                    $scope.submitErrorMsg = '';
                    $scope.selectedPermission = p;
                    $scope.deleteInstanceDialog = ngDialog.open({
                        template: './views/directive/role/permission-delete.html',
                        className: 'ngdialog-custom-default',
                        scope: $scope
                    });
                };

                $scope.$watch('id', function () {
                    if ($scope.id) {
                        $scope.queryUser();
                    }
                });
            }
        };
    }

    return {
        name: 'userGroup',
        directiveFn: ['$location', 'RoleSvc', 'ngDialog', fn]
    };
});
