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

                $scope.criteria = {
                    name: ''
                };

            // Event listeners
                $scope.lastCritria = null;
                $scope.queryUser = function () {
                    var searchCriteria = {
                        name: $scope.criteria.name ? $scope.criteria.name : null,
                        roleId: $scope.id
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.users = [];
                    RoleSvc.getRolePermission(searchCriteria, function (resp) {
                        if (!resp || !resp.data || !resp.data.length) {
                            $scope.users = [];
                            $scope.loadingStatus = Constant.loadEmpty;
                            return;
                        }
                        $scope.loadingStatus = '';
                        $scope.users = resp.data;
                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
                    });
                };

                $scope.deletePermission = function (id) {
                    RoleSvc.deletePermission({ id: id }, function () {
                        $scope.queryUser();
                    }, function (error) {
                        var resp = (error && error.data) || {};

                        var msg = resp.errMsg ? resp.errMsg : Constant.createError;

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
