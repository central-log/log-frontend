define(['utils/Constant'], function (Constant) {
  function fn($location, UserSvc, GroupSvc, CommonSvc, localStorageService,ngDialog) {
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

          //Event listeners
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

          $scope.submitText = '添加';
          $scope.addUserDialog = function(){
            $scope.newUser = {
              enabled: true,
              userType: 'Normal'
            };
            $scope.submitErrorMsg = '';
            $scope.addInstanceDialog = ngDialog.open({
              template: 'views/directive/user/user-add.html',
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

              $scope.newUser.domainId=$scope.domainId;
              $scope.newUser.env=$scope.env;

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
      }
    };
  }

  return {
    name: 'domainUser',
    directiveFn: ["$location", "UserSvc", "GroupSvc", "CommonSvc", "localStorageService", 'ngDialog', fn]
  };
});
