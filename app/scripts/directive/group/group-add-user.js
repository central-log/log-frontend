'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, UserSvc, GroupSvc) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/group/group-add-user.html',
            link: function ($scope) {


                $scope.$watch('id', function () {
                    if ($scope.id) {
                        $scope.onsearch();
                    }
                });

                function buildDisplayData(result) {
                    $scope.roles = result.data;

                    $scope.pagination.curPage = result.page;
                    $scope.pagination.totalCount = result.totalCount;
                    $scope.pagination.pageSize = result.pageSize;

                    $scope.addedList.forEach(function (addedR) {

                        $scope.roles.find(function (r) {
                            if (r.email === addedR.email) {
                                r.added = true;
                                return true;
                            }
                            return false;
                        });
                    });

                }
                $scope.criteria = {
                    email: ''
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
                        email: $scope.criteria.email ? $scope.criteria.email : null,
                        pageSize: $scope.pagination.pageSize,
                        page: $scope.pagination.curPage
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.roles = [];
                    UserSvc.getUsers(searchCriteria, function (result) {

                        if (!result || !result.data || !result.data.length) {
                            $scope.roles = [];
                            $scope.loadingStatus = Constant.loadEmpty;
                            return;
                        }

                        GroupSvc.getUsers({ groupId: $scope.id },
                            function (addedList) {
                                $scope.loadingStatus = '';
                                $scope.addedList = addedList;

                                if (!addedList || !addedList.length) {
                                    $scope.addedList = [];
                                }

                                buildDisplayData(result);

                            }, function () {
                                $scope.loadingStatus = '';
                                $scope.addedList = [];
                                buildDisplayData(result);
                            });

                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
                    });
                };

                $scope.addRole = function (roleId) {
                    GroupSvc.addUser({ categoryId: roleId, groupId: $scope.id }, function () {
                        $scope.roles.find(function (r) {
                            if (r.email === roleId) {
                                r.added = 'added';
                                return true;
                            }
                            return false;
                        });
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
        name: 'groupAddUser',
        directiveFn: ['$location', 'UserSvc', 'GroupSvc', fn]
    };
});
