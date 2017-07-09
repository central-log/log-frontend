'use strict';
define(['utils/Constant'], function (Constant) {
    var Controller = function ($scope, $routeParams, RoleSvc, CommonSvc, URISvc) {
        $scope.criteria = {
            name: ''
        };
        $scope.roleId = $routeParams.roleId;

        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

        function generatorDropdown(name, items, defaultOpt) {
            $scope[name] = {};
            $scope[name].isOpen = false;
            if (!defaultOpt) {
                $scope[name].option = items[0];
            } else {
                $scope[name].option = defaultOpt;
            }
            $scope[name].selectOption = function (option) {
                $scope[name].option = option;
            };
            $scope[name].items = items;
        }

        function getGroupList() {
            CommonSvc.getDomains({}, function (resp) {
                $scope.domains = resp.result;
        /* $scope.domains.unshift({
          displayName: '请选择',
          id: '',
          name: ''
        });*/
                generatorDropdown('domainDropdown', $scope.domains);
            });
        }
        getGroupList();

        $scope.onsearch = function () {
            $scope.bindList = [];
            $scope.searchRslt = [];
            $scope.loadingStatus = Constant.loading;

            URISvc.queryURI({
                name: $scope.criteria.name,
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize,
                domainId: $scope.domainDropdown.option ? $scope.domainDropdown.option.id : ''
            }, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    $scope.searchRslt = [];
                    return;
                }
        // No Pagination
                if (!result || !result.data || !result.data.length) {

                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';

                $scope.searchRslt = resp.result.data.map(function (menu) {
                    menu.selected = false;
                    return menu;
                });
        // $scope.pagination.curPage = resp.result.page;
                $scope.pagination.totalCount = resp.result.totalCount;
        // $scope.pagination.pageSize = resp.result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };
        $scope.bindList = [];
        $scope.toggleAll = function (selectAll) {
            if (!selectAll) {
                $scope.searchRslt.map(function (d) {
                    d.selected = true;
                    return d;
                });
                $scope.bindList = $scope.searchRslt.map(function (d) {
                    return d.id;
                });
            } else {
                $scope.searchRslt.map(function (d) {
                    d.selected = false;
                    return d;
                });
                $scope.bindList = [];
            }
        };
        $scope.toggle = function (menu) {
            menu.selected = !menu.selected;
            var i, len = $scope.bindList.length;

            for (i = 0; i < len; i++) {
                if ($scope.bindList[i] === menu.id) {
                    $scope.bindList.splice(i, 1);
                    break;
                }
            }
            if (i === len) {
                $scope.bindList.push(menu.id);
            }
            $scope.selectAll = ($scope.bindList.length === $scope.searchRslt.length);
        };
        $scope.bind = function () {
            $scope.bindResult = '';
            if (!$scope.bindList.length) {
                return;
            }
            RoleSvc.addRoleURLs({
                roleId: $scope.roleId,
                uriIds: $scope.bindList.join(',')
            }, function () {
                $scope.bindResult = 'success';
                $scope.saveNum = $scope.bindList.length;
            }, function () {
                $scope.bindResult = 'failed';
            });
        };

        CommonSvc.getDomains({}, function (domains) {
            $scope.domains = domains;
            $scope.criteria.domain = domains[0];
        });

    };

    return {
        name: 'RoleURLController',
        fn: ['$scope', '$routeParams', 'RoleSvc', 'CommonSvc', 'URISvc', Controller]
    };

});
