'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, RoleSvc) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/role/role-permission.html',
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
                    RoleSvc.deletePermission({ roleId: $scope.id, permissionId: id }, function () {
                        $scope.queryUser();
                    }, function (error) {
                        var resp = (error && error.data) || {};

                        var msg = resp.errMsg ? resp.errMsg : Constant.operateError;

                        alert(msg);
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
        name: 'rolePermission',
        directiveFn: ['$location', 'RoleSvc', fn]
    };
});
