'use strict';
define(['utils/Constant', 'utils/Utils'], function (Constant, Utils) {
    var Controller = function ($scope, $location, GroupSvc, Common, localStorageService) {

        $scope.groupTypeLoaded = false;
        Common.getGroupTypes().then(function (types) {
            $scope.groupTypeLoaded = true;
            $scope.groupTypeObj = types;
            $scope.groupTypeList = Utils.convertToArr(types);
            $scope.groupTypeList.unshift({
                name: '请选择',
                value: null
            });
            Utils.generatorDropdown($scope, 'groupTypeDropdown', $scope.groupTypeList);
        }, function () {
            $scope.groupTypeLoaded = true;
            $scope.groupTypeList = [];
            $scope.groupTypeList.unshift({
                name: '请选择',
                value: null
            });
            Utils.generatorDropdown($scope, 'groupTypeDropdown', $scope.groupTypeList);
        });
    // pagination
        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

    // Event listeners
        $scope.queryGroup = function () {
            var params = $scope.groupQuery;

            var count = 0,
                total = 0;

            for (var prop in params) {
                total++;
                if (params[prop] === null || typeof params[prop] === 'undefined') {
                    count++;
                }
            }

            if (count === total) {
        // return false;
            }
            if (!params) {
                params = {};
            }
            params.page = $scope.pagination.curPage;
            params.pageSize = Constant.hackMaxPageSize;

            $scope.groups = [];
            $scope.groupsLoading = Constant.loading;

            GroupSvc.getGroups(params, function (res) {

                var result = Constant.transformResponse(res);

                if (result === undefined) {
                    $scope.groupsLoading = Constant.loadError;
                    return;
                }
                if (!result || !result.data || !result.data.length) {
                    $scope.groupsLoading = Constant.loadEmpty;
                    return;
                }
                $scope.groupsLoading = '';
                $scope.groups = result.data;

                $scope.pagination.curPage = res.result.page;
                $scope.pagination.totalCount = res.result.totalCount;
                $scope.pagination.pageSize = Constant.hackMaxPageSize;

            }, function () {
                $scope.groups = [];
                $scope.groupsLoading = Constant.loadError;
            });
        };

        $scope.queryGroup();

        $scope.storeGroupDetail = function (detail) {
            localStorageService.set('groupDetail', detail);
        };

        $scope.addGroupDisable = function () {
            return !$scope.newGroup || !$scope.newGroup.province || !$scope.newGroup.city || !$scope.newGroup.district;
        };
        $scope.addNewGroup = function () {
            if (typeof $scope.newGroup === 'undefined') {
                return false;
            }

            for (var prop in $scope.newGroup) {
                if (typeof $scope.newGroup[prop] === 'undefined' || $scope.newGroup[prop] === null || $scope.newGroup[prop] === '请选择') {
                    return false;
                }
            }

            $scope.newGroup.groupType = ($scope.groupTypeDropdown.option && $scope.groupTypeDropdown.option.value) ? $scope.groupTypeDropdown.option.value : null;
            $scope.newGroup.enabled = true;

            GroupSvc.addGroup($scope.newGroup, function (res) {
                $scope.createSuccess = true;
                $location.path('/group/' + res.result);
            }, function () {
                $scope.createSuccess = false;
            });
        };

        $scope.disableDropdownList = Constant.disableDropdownList;
    };

    return {
        name: 'GroupController',
        fn: ['$scope', '$location', 'GroupSvc', 'Common', 'localStorageService', Controller]
    };


});
