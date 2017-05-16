'use strict';
/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */

  var DomainController = function ($scope, DomainSvc, $cookies, $routeParams, UserSvc, CommonSvc) {

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
      CommonSvc.getDomains($scope.criteria, function (resp) {
        var result = Constant.transformResponse(resp);
        if (result === undefined) {
          $scope.loadingStatus = Constant.loadError;
          $scope.domains = [];
          $scope.domain = {};
          return;
        }
        if (!result || !result.length) {
          $scope.domains = [];
          $scope.domain = {};
          $scope.loadingStatus = Constant.loadEmpty;
          return;
        }
        $scope.loadingStatus = '';
        $scope.domains = result;
        if (domainId) {
          for (var i = 0, len = $scope.domains.length; i < len; i++) {
            if ($scope.domains[i].id === Number.parseInt(domainId)) {
              $scope.domain = $scope.domains[i];
              break;
            }
          }
        }
      }, function () {
        $scope.loadingStatus = Constant.loadError;
      });
    };
    $scope.onsearch();
    if (domainId) {
      $scope.getUsersByPage();
    }

  };

  return {
    name: "DomainController",
    fn: ["$scope", "DomainSvc", "$cookies", "$routeParams", "UserSvc", "CommonSvc", DomainController]
  };


});
