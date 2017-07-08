define(['utils/Constant'], function (Constant) {
    function fn($location, UserSvc, GroupSvc, CommonSvc, localStorageService, ngDialog) {
        return {
            restrict: 'E',
            scope: {
                domainId: '=',
                env: '='
            },
            templateUrl: 'views/directive/domain/user.html',
            link: function ($scope) {
                $scope.userTypes = Constant.userTypes;

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
                $scope.queryUser = function () {
                    var searchCriteria = {
                        email: $scope.criteria.email ? $scope.criteria.email : null,
                        pageSize: $scope.pagination.pageSize,
                        page: $scope.pagination.curPage,
                        domainId: $scope.domainId,
                        env: $scope.env
                    };

                    $scope.lastCritria = searchCriteria;
                    $scope.loadingStatus = Constant.loading;
                    $scope.users = [];
                    UserSvc.getUsers(searchCriteria, function (resp) {
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

                $scope.queryUser();

                $scope.addModifyUserDialog = function (editUser) {
                    $scope.isModify = !!editUser;

                    if ($scope.isModify) {
                        $scope.newUser = {
                            name: editUser.name,
                            email: editUser.email,
                            status: editUser.status,
                            userType: editUser.userType,
                            domainId: $scope.domainId,
                            env: $scope.env
                        };
                    } else {
                        $scope.newUser = {
                            domainId: $scope.domainId,
                            env: $scope.env,
                            status: 'enabled',
                            userType: 'Normal'
                        };
                    }
                    $scope.submitErrorMsg = '';
                    $scope.addInstanceDialog = ngDialog.open({
                        template: 'views/directive/user/user-add.html',
                        className: 'ngdialog-custom-default',
                        scope: $scope
                    });
                };

                $scope.submitDisable = function () {
                    if (!$scope.newUser.name || !$scope.newUser.status || !$scope.newUser.userType || !$scope.newUser.email) {
                        return true;
                    }
                    if ($scope.submiting) {
                        return true;
                    }
                    return false;
                };

                $scope.addModifyNewUser = function (isModifyUser, isDelete) {
                    $scope.submitErrorMsg = '';
                    if (!$scope.newUser.name || !$scope.newUser.email) {
                        return;
                    }
                    $scope.submiting = true;
                    var serviceName = isDelete ? 'deleteUser' : (isModifyUser ? 'editUser' : 'addUser');

                    UserSvc[serviceName]($scope.newUser, function () {
                        $scope.submiting = false;
                        $scope.submitErrorMsg = '';
                        $scope.loadingStatus = '';
                        $scope.addInstanceDialog.close();
                        $scope.queryUser();
                    }, function (error) {
                        var resp = (error && error.data) || {};

                        $scope.submiting = false;
                        $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                    });
                };
            }
        };
    }

    return {
        name: 'domainUser',
        directiveFn: ['$location', 'UserSvc', 'GroupSvc', 'CommonSvc', 'localStorageService', 'ngDialog', fn]
    };
});
