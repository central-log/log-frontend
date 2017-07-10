'use strict';
define(['utils/Constant', 'utils/Utils'], function (Constant, Utils) {
    var Controller = function ($scope, $location, $routeParams, GroupSvc, UserSvc, Common) {


        $scope.paramGroupId = $routeParams.id;
        $scope.getGroupTypeText = function () {
            if ($scope.groupTypeLoaded && $scope.loadingGroupDetail) {
                return $scope.groupTypeObj ? $scope.groupTypeObj[$scope.groupDetail.groupType] : $scope.groupDetail.groupType;
            }
            return Constant.loading;
        };
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

    // get groupDetail
        $scope.loadingGroupDetail = false;
        GroupSvc.getGroupById({
            groupId: $routeParams.id
        }, function (res) {
            $scope.loadingGroupDetail = true;
            $scope.groupDetail = res.result;
            $scope.newGroupType = $scope.groupDetail.groupType;
        }, function () {
            $scope.loadingGroupDetail = true;
            $scope.groupDetial = {};
        });

        $scope.loadingGroupUser = Constant.loading;
        $scope.groupUsers = [];
        UserSvc.getUsers({
            groupId: $routeParams.id,
            page: 1,
            pageSize: Constant.pageSize
        }, function (res) {
            var result = Constant.transformResponse(res);

            if (result === undefined) {
                $scope.loadingGroupUser = Constant.loadError;
                return;
            }
      // No Pagination
            if (!result || !result.data || !result.data.length) {

                $scope.loadingGroupUser = Constant.loadEmpty;
                return;
            }
            $scope.loadingGroupUser = '';
            $scope.groupUsers = result.data;
        }, function () {
            $scope.loadingGroupUser = Constant.loadError;
        });

        $scope.addSubGroupDisable = function () {
            return !$scope.newSubGroupName ||
        !$scope.newSubGroupDesc ||
        !$scope.groupDetail.province ||
        !$scope.groupDetail.city ||
        !$scope.groupDetail.district;
        };

    // Event listeners
        $scope.addSubGroup = function () {
            var params = {
                parentId: $routeParams.id,
                name: $scope.newSubGroupName,
                description: $scope.newSubGroupDesc,
                province: $scope.groupDetail.province,
                city: $scope.groupDetail.city,
                district: $scope.groupDetail.district
            };

            for (var prop in params) {
                if (typeof params[prop] === 'undefined' || params[prop] === null || params[prop] === '请选择') {
                    return false;
                }
            }
            params.groupType = $scope.newGroupType ? $scope.newGroupType : null;
            GroupSvc.addSubGroup(params, function (res) {
                $scope.addSubGroupSuccess = true;
                $location.path('/group/' + res.result);
            }, function () {
                $scope.addSubGroupSuccess = false;
            });
        };

        $scope.modifyGroupDetail = function () {
            for (var prop in $scope.groupDetail) {
        // groupType is optional
                if (prop !== 'groupType') {
                    if (typeof $scope.groupDetail[prop] === 'undefined' || $scope.groupDetail[prop] === null ||
            $scope.groupDetail[prop] === '请选择' || $scope.groupDetail[prop] === '') {
                        return false;
                    }
                }
            }
            var updateGroupEntity = angular.copy($scope.groupDetail);

            updateGroupEntity.parentId = updateGroupEntity.parentGroupId;
            if ('parentGroupId' in updateGroupEntity) {
                delete updateGroupEntity.parentGroupId;
            }
            if ('parentGroupName' in updateGroupEntity) {
                delete updateGroupEntity.parentGroupName;
            }

            GroupSvc.modifyGroup(updateGroupEntity, function () {
                $scope.modifyGroupDetailSuccess = true;
                $location.url('/group/' + $routeParams.id);
            }, function () {
                $scope.modifyGroupDetailSuccess = false;
            });
        };

    /* // toggle enable group
    $scope.disableGroup = function () {

      var updateGroupEntity = angular.copy($scope.groupDetail);
      updateGroupEntity.enabled = !updateGroupEntity.enabled;
      updateGroupEntity['parentId']= updateGroupEntity.parentGroupId;
      if("parentGroupId" in updateGroupEntity){
        delete updateGroupEntity.parentGroupId;
      }
      if("parentGroupName" in updateGroupEntity){
        delete updateGroupEntity.parentGroupName;
      }

      GroupSvc.modifyGroup(updateGroupEntity, function (data) {
        $scope.groupDetail.enabled = !$scope.groupDetail.enabled;
        $scope.disableGroupSuccess = true;
      }, function () {
        $scope.disableGroupSuccess = false;
      });
    };*/

    // disable dialog
        $scope.disableDialog = {
            title: '禁用组',
            description: '确定禁用该组吗？',
            beforeOpen: function () {
                if ($scope.groupDetail.enabled) {
                    this.title = '禁用组';
                    this.description = '确定禁用该组吗？';
                } else {
                    this.title = '启用组';
                    this.description = '确定启用该组吗？';
                }
            },
            requestSender: {
                method: GroupSvc.modifyGroup,
                params: function () {

                    var updateGroupEntity = angular.copy($scope.groupDetail);

                    updateGroupEntity.enabled = !updateGroupEntity.enabled;
                    updateGroupEntity.parentId = updateGroupEntity.parentGroupId;
                    if ('parentGroupId' in updateGroupEntity) {
                        delete updateGroupEntity.parentGroupId;
                    }
                    if ('parentGroupName' in updateGroupEntity) {
                        delete updateGroupEntity.parentGroupName;
                    }

                    return updateGroupEntity;
                },
                success: function () {
                    $scope.groupDetail.enabled = !$scope.groupDetail.enabled;
                    $scope.disableGroupSuccess = true;
                },
                error: function () {}
            }
        };

    // pagination
        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };

        $scope.getUserOfGroupByPage = function () {
            UserSvc.getUsers({
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize
            }, function (res) {
                $scope.groupUsers = res.result.data;
                $scope.pagination.curPage = res.result.page;
                $scope.pagination.totalCount = res.result.totalCount;
            });

        };

        $scope.getGroups = function () {
            GroupSvc.getGroups({
                page: 1,
                pageSize: Constant.hackMaxPageSize
            }, function (res) {
                if (!res || !res.result || !res.result.data) {
                    $scope.groupList = [];
                } else {
                    $scope.groupList = res.result.data;
                }
            });
        };
        $scope.getGroups();
    };

    return {
        name: 'GroupDetailController',
        fn: ['$scope', '$location', '$routeParams', 'GroupSvc', 'UserSvc', 'Common', Controller]
    };
});
