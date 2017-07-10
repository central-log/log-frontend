'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, UserSvc, RoleSvc) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/user/user-add-role.html',
            link: function ($scope) {

                $scope.$watch('id', function () {
                    if ($scope.id) {
                        $scope.onsearch();
                    }
                });

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
                $scope.onsearch = function () {
                    var searchCriteria = {
                        name: $scope.criteria.name ? $scope.criteria.name : null,
                        pageSize: $scope.pagination.pageSize,
                        page: $scope.pagination.curPage
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.roles = [];
                    RoleSvc.getRoles(searchCriteria, function (result) {

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

                $scope.addRole = function (roleId) {
                    UserSvc.addRole({ roleId: roleId, userId: $scope.id }, function () {
                    }, function (error) {
                        var resp = (error && error.data) || {};
                        var msg = resp.errMsg ? resp.errMsg : Constant.operateError;

                        alert(msg);
                    });
                };

            }
        };
    }

    return {
        name: 'userAddRole',
        directiveFn: ['$location', 'UserSvc', 'RoleSvc', fn]
    };
});
