'use strict';
define(['utils/Constant'], function (Constant) {
    function fn($location, RoleSvc, PermissionSvc) {
        return {
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: 'views/directive/group/group-add-user.html',
            link: function ($scope) {

                function buildDisplayData() {
                    $scope.users.forEach(function (p) {
                        if (!(p.type in $scope.displayData)) {
                            $scope.displayData[p.type] = [p];
                        } else {
                            $scope.displayData[p.type].push(p);
                        }
                    });
                    $scope.types = Object.keys($scope.displayData);

                    $scope.addedPermissionList.forEach(function (p) {
                        var target = $scope.displayData[p.type];

                        target.find(function (e) {
                            if (e.id === p.id) {
                                e.added = true;
                            }
                        });
                    });
                    console.log($scope.displayData);
                }
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
                        $scope.users = resp;

                        if (!$scope.users.length) {
                            $scope.loadingStatus = Constant.loadEmpty;
                            return;
                        }

                        RoleSvc.getRolePermission({ roleId: $scope.id },
                          function (addedPermissionList) {
                              $scope.loadingStatus = '';
                              $scope.addedPermissionList = addedPermissionList;

                              if (!addedPermissionList || !addedPermissionList.length) {
                                  $scope.addedPermissionList = [];
                              }

                              buildDisplayData();

                          }, function () {
                              $scope.loadingStatus = '';
                              $scope.addedPermissionList = [];
                              buildDisplayData();
                          });

                    }, function () {
                        $scope.loadingStatus = Constant.loadError;
                    });
                };

                $scope.addPermission = function (type, index, id) {
                    RoleSvc.addPermission({ roleId: $scope.id, permissionId: id }, function () {
                        $scope.displayData[type][index].added = 'added';
                        console.log($scope.displayData);
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
        name: 'groupAddUser',
        directiveFn: ['$location', 'RoleSvc', 'PermissionSvc', fn]
    };
});
