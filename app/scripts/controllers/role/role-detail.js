'use strict';
define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, $routeParams, RoleSvc, UserSvc, MenuSvc, URISvc, $location) {

        var paginationInitial = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

        $scope.paramRoleId = $routeParams.roleId;
        $scope.modifyRole = function () {
            RoleSvc.modifyRole({
                id: $routeParams.roleId,
                name: $scope.modifyRoleInfo.name,
                description: $scope.modifyRoleInfo.description,
                enabled: $scope.modifyRoleInfo.enabled
            }, function () {
                $scope.role = $scope.modifyRoleInfo;
                $scope.modifySuccess = 'success';
                $location.url('/role/' + $routeParams.roleId);
            }, function () {
                $scope.modifySuccess = 'failed';
            });
        };
        $scope.getNextData = function () {

            switch ($scope.currentTab) {
                case 'menu':
                    $scope.getRoleMenus();
                    break;
                case 'url':
                    $scope.getRoleURLs();
                    break;
                case 'user':
                    $scope.getRoleUsers();
                    break;
                default:
            }
        };
        $scope.getRoleMenus = function () {
            $scope.roleMenus = [];
            $scope.loadingStatus = Constant.loading;
            MenuSvc.queryMenu({
                roleId: $routeParams.roleId,
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize
            }, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    $scope.roleMenus = [];
                    return;
                }
        // No Pagination
                if (!result || !result.data || !result.data.length) {
                    $scope.roleMenus = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';
                $scope.roleMenus = result.data;
                $scope.pagination.curPage = result.page;
                $scope.pagination.totalCount = result.totalCount;
                $scope.pagination.pageSize = result.pageSize;

            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };
        $scope.getRoleURLs = function () {
            $scope.loadingStatus = Constant.loading;
            $scope.roleURLs = [];
            URISvc.queryURI({
                roleId: $routeParams.roleId,
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize
            }, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    $scope.roleURLs = [];
                    return;
                }
        // No Pagination
                if (!result || !result.data || !result.data.length) {
                    $scope.roleURLs = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';

                $scope.roleURLs = result.data;
                $scope.pagination.curPage = result.page;
                $scope.pagination.totalCount = result.totalCount;
                $scope.pagination.pageSize = result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };
        $scope.getRoleUsers = function () {
            $scope.loadingStatus = Constant.loading;
            $scope.roleUsers = [];
            UserSvc.getUsers({
                roleId: $routeParams.roleId,
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize
            }, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    $scope.roleUsers = [];
                    return;
                }
        // No Pagination
                if (!result || !result.data || !result.data.length) {
                    $scope.roleUsers = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';
                $scope.roleUsers = result.data;
                $scope.pagination.curPage = result.page;
                $scope.pagination.totalCount = result.totalCount;
                $scope.pagination.pageSize = result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };


        $scope.menuDialog = {
            title: '移除菜单',
            description: '确定要移除该菜单吗？',
            requestSender: {
                method: RoleSvc.removeRoleMenus,
                params: function () {
                    return {
                        roleId: $routeParams.roleId,
                        menuIds: $scope.menuDialog.actionId
                    };
                },
                success: function () {
                    $scope.getRoleMenus();
                }
            },
      // optional
            errorMsg: '移除菜单失败，请稍后再试'
        };

        $scope.urlDialog = {
            title: '移除URL/模式',
            description: '确定要移除该URL/模式吗？',
            requestSender: {
                method: RoleSvc.removeRoleURLs,
                params: function () {
                    return {
                        roleId: $routeParams.roleId,
                        uriIds: $scope.urlDialog.actionId
                    };
                },
                success: function () {
                    $scope.getRoleURLs();
                }
            },
      // optional
            errorMsg: '移除URL/模式失败，请稍后再试'
        };
        $scope.userDialog = {
            title: '移除用户',
            description: '确定要删除该用户吗？',
            requestSender: {
                method: RoleSvc.removeRoleUsers,
                params: function () {
                    return {
                        roleId: $routeParams.roleId,
                        userIds: $scope.userDialog.actionId
                    };
                },
                success: function () {
                    $scope.getRoleUsers();
                }
            },
      // optional
            errorMsg: '移除用户失败，请稍后再试'
        };

        RoleSvc.getRoleById({
            roleId: $routeParams.roleId
        }, function (resp) {
            $scope.role = resp;
            $scope.loadingDetailStatus = '';
        }, function () {
            $scope.loadingDetailStatus = Constant.loadError;
            $scope.role = null;
        });

        // $scope.switchTab('menu');
    };

    return {
        name: 'RoleDetailController',
        fn: ['$scope', '$routeParams', 'RoleSvc', 'UserSvc', 'MenuSvc', 'URISvc', '$location', Controller]
    };


});
