
/**
 * Module representing a shirt.
 * @module controllers/User
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a User controller.
   * @exports controllers/User
   */
  var Controller = function ($scope, $location, UserSvc, GroupSvc, CommonSvc, localStorageService,ngDialog) {
    $scope.criteria = {
      email: ''
    };

    $scope.pagination = {
      pageSize: Constant.pageSize,
      curPage: 1,
      totalCount: 0
    };

    //Event listeners
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
        UserSvc.getUsers(searchCriteria, function (resp) {
          var result = Constant.transformResponse(resp);
          if (result === undefined) {
            $scope.loadingStatus = Constant.loadError;
            $scope.users = [];
            return;
          }
          // No Pagination
          if (!result || !result.data || !result.data.length) {
            $scope.users = [];
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

    // dropdown list
    // $scope.disableDropdownList = Constant.disableDropdownList;

    // $scope.roleTypeDropdownList = Constant.roleTypesArr;

    // $scope.getGroups = function () {
    //   GroupSvc.getGroups({
    //     page: 1,
    //     pageSize: Constant.hackMaxPageSize // HACK
    //   }, function (res) {
    //     if (!res || !res.result || !res.result.data) {
    //       $scope.groupList = [];
    //     } else {
    //       $scope.groupList = res.result.data;
    //     }
    //     $scope.groupList.unshift({
    //       name: '请选择',
    //       value: null
    //     });
    //   });
    // };
    // $scope.getGroups();

    $scope.submitText = '添加';
    $scope.addUserDialog = function(){
      $scope.newUser = {
        enabled: true
      };
      $scope.submitErrorMsg = '';
      $scope.addInstanceDialog = ngDialog.open({
        template: './views/user/user-add.html',
        className: 'ngdialog-custom-default',
        scope: $scope
      });
    }

    $scope.submitDisable = function(){
      if (!$scope.newUser.name || !$scope.newUser.email) {
        return true;
      }
      if($scope.submiting){
        return true;
      }
      return false;
    }

    $scope.addNewUser = function () {

        $scope.submitErrorMsg = '';
        if (!$scope.newUser.name || !$scope.newUser.email) {
          return;
        }
        $scope.submiting = true;
        UserSvc.addUser($scope.newUser, function (resp) {
          $scope.submiting = false;
          var result = Constant.transformResponse(resp);
          if (!result) {
            $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
            return;
          }
          $scope.submitErrorMsg = '';
          // console.log($scope);
          $scope.users.unshift(result);
          $scope.loadingStatus = '';
          $scope.addInstanceDialog.close();
          // $location.url('/role/' + result);
        }, function (resp) {
          $scope.submiting = false;
          $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
        });

    };
  };

  return {
    name: "UserController",
    fn: ["$scope", "$location", "UserSvc", "GroupSvc", "CommonSvc", "localStorageService", 'ngDialog', Controller]
  };


});
