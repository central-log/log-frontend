'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, RoleSvc, PermissionSvc) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/role/add-permission.html',
            link: function ($scope) {

                $scope.criteria = {
                    name: ''
                };
            // Event listeners
                $scope.lastCritria = null;
                $scope.getPermissions = function () {
                    $scope.displayData = {};
                    $scope.types = [];
                    var searchCriteria = {
                        name: $scope.criteria.name ? $scope.criteria.name : null
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.users = [];
                    PermissionSvc.getAllPermission(searchCriteria, function (resp) {
                        $scope.loadingStatus = '';
                        $scope.users = resp;

                        if (!$scope.users.length) {
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

                $scope.addPermission = function (type, index, id) {
                    RoleSvc.addPermission({ roleId: $scope.id, permissionId: id }, function () {
                        $scope.displayData[type][index].added = true;
                    }, function (error) {
                        var resp = (error && error.data) || {};
                        var msg = resp.errMsg ? resp.errMsg : Constant.operateError;

                        alert(msg);
                    });
                };
                $scope.$watch('id', function () {
                    if ($scope.id) {
                        $scope.getPermissions();
                    }
                });
            }
        };
    }

    return {
        name: 'roleAddPermission',
        directiveFn: ['$location', 'RoleSvc', 'PermissionSvc', fn]
    };
});
