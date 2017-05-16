'use strict';
/**
 * Module representing a shirt.
 * @module controllers/User
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a User controller.
   * @exports controllers/UserlocalLlo
   */
  var Controller = function ($scope, $window, $routeParams, $filter, UserSvc, GroupSvc, RoleSvc, CommonSvc, localStorageService, $location) {

    $scope.pagination = {
      pageSize: Constant.pageSize,
      curPage: 1,
      totalCount: 0
    };
    $scope.paraUserId = $routeParams.id;
    // user detail
    if ($routeParams.id) {
      UserSvc.getUserById({
        id: $routeParams.id
      }, function (res) {
        $scope.userDetail = res.result;

        $scope.userDetail.roleTypeText = Constant.roleTypesObj[res.result.roleType];
        $scope.userDetail.roleTypeText = $scope.userDetail.roleTypeText ? $scope.userDetail.roleTypeText : '';
        if (angular.isDefined(res.result.groupName)) {
          return false;
        }
        GroupSvc.getGroups({
          page: 1,
          pageSize: Constant.hackMaxPageSize
        }, function (res) {
          var data = res.result.data;

          for (var i in data) {
            if (i.id === $scope.userDetail.groupId) {
              $scope.userDetail.groupName = i.name;
              return false;
            }
          }
        });
      }, function () {
        $scope.userDetail = {};
      });
    }

    // get all roles listener
    $scope.getAllRolesByPage = function () {

      $scope.allRoles = [];
      $scope.roleAddLoading = Constant.loading;

      RoleSvc.getRoles({
        page: $scope.pagination.curPage,
        pageSize: $scope.pagination.pageSize
      }, function (res) {

        var result = Constant.transformResponse(res);
        if (result === undefined) {
          $scope.roleAddLoading = Constant.loadError;
          return;
        }
        if (!result || !result.data || !result.data.length) {
          $scope.roleAddLoading = Constant.loadEmpty;
          return;
        }

        $scope.roleAddLoading = '';
        $scope.allRoles = result.data;

        $scope.pagination.curPage = result.page;
        $scope.pagination.totalCount = result.totalCount;
        $scope.pagination.pageSize = result.pageSize;

        $scope.allRoles = $filter('filter')(result.data, {
          enabled: true
        });
        var list = $scope.allRoles;
        // bind a watcher to every role
        // This version of angular (1.2.16) doesn't support $scope.$watchGroup
        // and $watchCollection only accept first argument as object
        for (var i = 0; i < list.length; i++) {
          $scope.$watchCollection('allRoles[' + i + ']', function (newVal) {
            for (var j = 0; j < $scope.allRoles.length; j++) {
              if ($scope.allRoles[j].toAdd !== newVal.toAdd) {
                $scope.roleAllSelected = false;
                return false;
              }
            }

            $scope.roleAllSelected = newVal.toAdd;
          });
        }

        // first value
        $scope.roleAllSelected = true;
        for (i = 0; i < list.length; i++) {
          if (list[i].toAdd === false) {
            $scope.roleAllSelected = false;
            return false;
          }
        }
      }, function () {
        $scope.allRoles = [];
        $scope.roleAddLoading = Constant.loadError;
      });
    };

    $scope.getAllRolesByPage();

    // user's role
    $scope.getRoles = function () {
      $scope.userRoleLoading = Constant.loading;
      $scope.roleOfUser = [];
      UserSvc.getRoleOfUser({
        id: $routeParams.id
      }, function (res) {
        var result = Constant.transformResponse(res);
        if (result === undefined) {
          $scope.userRoleLoading = Constant.loadError;
          return;
        }

        if (!result || !result.length) {
          $scope.userRoleLoading = Constant.loadEmpty;
          return false;
        }
        $scope.userRoleLoading = '';
        $scope.roleOfUser = result;
      }, function () {
        $scope.userRoleLoading = Constant.loadError;
      });
    };
    $scope.getRoles();

    //Event listeners
    $scope.modifyUser = function () {
      for (var prop in $scope.userDetail) {
        if (typeof $scope.userDetail[prop] === 'undefined' || $scope.userDetail[prop] === null ||
          $scope.userDetail[prop] === '') {
          return false;
        }
      }
      var updateEntity = {
        id: $scope.userDetail.id,
        name: $scope.userDetail.name,
        email: $scope.userDetail.email,
        phone: $scope.userDetail.phone,
        roleType: $scope.userDetail.roleType,
        groupId: $scope.userDetail.groupId
      };
      UserSvc.modifyUser(updateEntity, function () {
        $scope.modifyUserSuccess = true;
        $location.url('/user/' + $routeParams.id);
      }, function () {
        $scope.modifyUserSuccess = false;
      });
    };

    // toggle enable user
    $scope.disableUser = function () {
      var e = angular.copy($scope.userDetail);
      e.enabled = !e.enabled;
      UserSvc.modifyUser(e, function () {
        $scope.disableUserSuccess = true;
        $scope.userDetail.enabled = !$scope.userDetail.enabled;
      }, function () {
        $scope.disableUserSuccess = false;
      });
    };

    // add user's role
    $scope.manageRoleOfUser = function () {
      var roleList = $scope.allRoles,
        roleIdToAdd = [];

      for (var i = 0; i < roleList.length; i++) {
        if (roleList[i].toAdd === true) {
          roleIdToAdd.push(roleList[i].id);
        }
      }
      $scope.saveNums = roleIdToAdd.length;
      UserSvc.manageRoleOfUser({
        userId: $scope.userDetail.id,
        roleIds: roleIdToAdd.sort()
      }, function () {
        $scope.manageRoleOfUserSuccess = true;
      }, function () {
        $scope.manageRoleOfUserSuccess = false;
      });
    };

    // checkboc fn
    $scope.selectAllRoles = function () {

      for (var i = 0; i < $scope.allRoles.length; i++) {

        //hack
        $scope.allRoles[i].toAdd = !$scope.roleAllSelected;
      }
    };

    // disable dialog
    $scope.disableDialog = {
      title: '禁用用户',
      description: '确定禁用该用户吗？',
      beforeOpen: function () {
        if ($scope.userDetail.enabled) {
          this.title = '禁用用户';
          this.description = '确定禁用该用户吗？';
        } else {
          this.title = '启用用户';
          this.description = '确定启用该用户吗？';
        }
      },
      requestSender: {
        method: UserSvc.modifyUser,
        params: function () {
          //$scope.userDetail.enabled = !$scope.userDetail.enabled;

          var updateGroupEntity = {
            id: $scope.userDetail.id,
            enabled: !$scope.userDetail.enabled
          };
          return updateGroupEntity;
        },
        success: function () {
          $scope.disableUserSuccess = true;
          $scope.userDetail.enabled = !$scope.userDetail.enabled;
        },
        error: function () {
          $scope.disableUserSuccess = false;
          //$scope.userDetail.enabled = !$scope.userDetail.enabled;
        }
      }
    };

    // remove role of user modal
    $scope.removeRoleDialog = {
      title: '移除角色',
      description: '确定要删除该角色吗？',
      requestSender: {
        method: UserSvc.removeRoleOfUser,
        params: function () {
          return {
            userId: $routeParams.id,
            roleIds: [$scope.removeRoleDialog.actionId]
          };
        },
        success: function () {
          $scope.getRoles();
        }
      },
      //optional
      errorMsg: '移除角色失败，请稍后再试'
    };

    // dropdown list for group selection
    $scope.getGroups = function () {
      GroupSvc.getGroups({
        page: 1,
        pageSize: Constant.hackMaxPageSize // HACK
      }, function (res) {
        if (!res || !res.result || !res.result.data) {
          $scope.groupList = [];
        } else {
          $scope.groupList = res.result.data;
        }
      });
    };

    $scope.getGroups();
    $scope.roleTypeDropdownList = Constant.roleTypesArr;
  };

  return {
    name: "UserDetailController",
    fn: ["$scope", "$window", "$routeParams", "$filter", "UserSvc", "GroupSvc", "RoleSvc", "CommonSvc", "localStorageService", "$location", Controller]
  };


});
