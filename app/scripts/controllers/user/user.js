define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, UserSvc, ngDialog) {
        $scope.criteria = {
            email: ''
        };

        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

        $scope.lastCritria = null;
        $scope.queryUser = function () {
            var searchCriteria = {
                email: $scope.criteria.email ? $scope.criteria.email : null,
                pageSize: $scope.pagination.pageSize,
                page: $scope.pagination.curPage
            };

            $scope.lastCritria = searchCriteria;
            $scope.loadingStatus = Constant.loading;
            $scope.users = [];
            UserSvc.getUsers(searchCriteria, function (result) {
                if (!result || !result.data || !result.data.length) {
                    $scope.domains = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }

                $scope.loadingStatus = '';
                $scope.users = result.data;

                $scope.pagination.curPage = result.page;
                $scope.pagination.totalCount = result.totalCount;
                $scope.pagination.pageSize = result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };

        $scope.queryUser();

        $scope.submitText = '添加';
        $scope.addUserDialog = function () {
            $scope.newUser = {};
            $scope.submitErrorMsg = '';
            $scope.addInstanceDialog = ngDialog.open({
                template: './views/user/user-add.html',
                className: 'ngdialog-custom-default',
                scope: $scope
            });
        };

        $scope.submitDisable = function () {
            if (!$scope.newUser.name || !$scope.newUser.email) {
                return true;
            }
            if ($scope.submiting) {
                return true;
            }
            return false;
        };

        $scope.addNewUser = function () {

            $scope.submitErrorMsg = '';
            if (!$scope.newUser.name || !$scope.newUser.email) {
                return;
            }
            $scope.submiting = true;
            UserSvc.addUser($scope.newUser, function (resp) {
                $scope.submitErrorMsg = '';
                $scope.loadingStatus = '';
                $scope.addInstanceDialog.close();
                $scope.users.unshift(resp);
            }, function (error) {
                var resp = error.data;

                $scope.submiting = false;
                $scope.submitErrorMsg = (resp && resp.errMsg) ? resp.errMsg : Constant.createError;
            });

        };
    };

    return {
        name: 'UserController',
        fn: ['$scope', 'UserSvc', 'ngDialog', Controller]
    };


});
