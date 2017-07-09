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

                $scope.pagination = {
                    pageSize: Constant.pageSize,
                    curPage: 1,
                    totalCount: 0
                };

            // Event listeners
                $scope.lastCritria = null;
                $scope.queryUser = function () {
                    var searchCriteria = {
                        name: $scope.criteria.name ? $scope.criteria.name : null,
                        pageSize: $scope.pagination.pageSize,
                        page: $scope.pagination.curPage,
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
                        $scope.pagination.curPage = resp.page;
                        $scope.pagination.totalCount = resp.totalCount;
                        $scope.pagination.pageSize = resp.pageSize;
                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
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
