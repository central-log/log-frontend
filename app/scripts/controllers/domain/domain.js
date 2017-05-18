/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */

  var DomainController = function ($scope, DomainSvc, $cookies, $routeParams, UserSvc, CommonSvc, ngDialog) {

    $scope.criteria = {
      name: ''
    };

    $scope.pagination = {
      pageSize: Constant.pageSize,
      curPage: 1,
      totalCount: 0
    };

    var domainId = $routeParams.domainId;
    $scope.paramDomainId = $routeParams.domainId;
    $scope.getUsersByPage = function () {
      $scope.domainUsers = [];
      $scope.userLoading = Constant.loading;
      UserSvc.getUsers({
        domainId: domainId,
        page: $scope.pagination.curPage,
        pageSize: $scope.pagination.pageSize
      }, function (resp) {
        var result = Constant.transformResponse(resp);
        if (result === undefined) {
          $scope.userLoading = Constant.loadError;
          return;
        }
        if (!result || !result.data || !result.data.length) {
          $scope.userLoading = Constant.loadEmpty;
          return;
        }
        $scope.userLoading = '';

        $scope.domainUsers = result.data;
        $scope.pagination.curPage = result.page;
        $scope.pagination.totalCount = result.totalCount;
        $scope.pagination.pageSize = result.pageSize;
      }, function () {
        $scope.userLoading = Constant.loadError;
      });

    };
    $scope.roleTypes = Constant.roleTypesObj;

    $scope.removeDomainUserDialog = {
      title: '移除用户',
      description: '确定要删除该用户吗？',
      requestSender: {
        method: DomainSvc.removeDomainUsers,
        params: function () {
          return {
            domainId: $routeParams.domainId,
            userIds: $scope.removeDomainUserDialog.actionId
          };
        },
        success: function () {
          $scope.getUsersByPage();
        }
      },
      //optional
      errorMsg: '移除用户失败，请稍后再试'
    };

    $scope.onsearch = function () {
      $scope.loadingStatus = Constant.loading;
      $scope.domains = [];
      var searchCriteria = {
        name: $scope.criteria.name ? $scope.criteria.name.trim() : null,
        pageSize: $scope.pagination.pageSize,
        page: $scope.pagination.curPage
      };
      $scope.lastCritria = searchCriteria;

      DomainSvc.queryDomain(searchCriteria, function (resp) {
        var result = Constant.transformResponse(resp);
        if (result === undefined) {
          $scope.loadingStatus = Constant.loadError;
          $scope.domains = [];
          // $scope.domain = {};
          return;
        }
        if (!result || !result.data || !result.data.length) {
          $scope.domains = [];
          $scope.loadingStatus = Constant.loadEmpty;
          return;
        }

        $scope.loadingStatus = '';
        $scope.domains = result.data;

        $scope.pagination.curPage = result.page;
        $scope.pagination.totalCount = result.totalCount;
        $scope.pagination.pageSize = result.pageSize;

      }, function () {
        $scope.loadingStatus = Constant.loadError;
      });
    };

    $scope.onsearch();

    $scope.showAddDialog = function(){
      $scope.domainEntity = {

      };
      $scope.submitErrorMsg = '';
      $scope.addInstanceDialog = ngDialog.open({
        template: './views/domain/domain-add.html',
        className: 'ngdialog-custom-default',
        scope: $scope
      });
    }

    $scope.confirmAdd = function () {

        $scope.submitErrorMsg = '';
        $scope.submiting = true;
        DomainSvc.addDomain($scope.domainEntity, function (resp) {
          $scope.submiting = false;
          var result = Constant.transformResponse(resp);
          if (!result) {
            $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
            return;
          }
          $scope.submitErrorMsg = '';
          $scope.loadingStatus = '';
          $scope.addInstanceDialog.close();
          $scope.domains.unshift(result);
        }, function (resp) {
          $scope.submiting = false;
          $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
        });

    };

  };
  return {
    name: "DomainController",
    fn: ["$scope", "DomainSvc", "$cookies", "$routeParams", "UserSvc", "CommonSvc",'ngDialog', DomainController]
  };
});
