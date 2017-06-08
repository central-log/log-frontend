define(['utils/Constant','utils/Utils'], function (Constant, Utils) {

  var DomainController = function ($scope, DomainSvc, $cookies, $routeParams, UserSvc, CommonSvc, ngDialog) {

      $scope.paramDomainId = $routeParams.domainId;

      $scope.switchTab = function(tab){
        $scope.currentTab = tab;
      }
      $scope.switchTab('node');
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

      $scope.logLevels = Constant.logLevels;

      $scope.showAddEnvDialog = function(){
        $scope.domainEnvEntity = {
          logLevel: 'Log'
        };
        $scope.addEnvErrorMsg = '';
        $scope.addEnvInstanceDialog = ngDialog.open({
          template: './views/domain/domain-env-add.html',
          className: 'ngdialog-custom-default',
          scope: $scope
        });
      }

      $scope.confirmEnvAdd = function () {

            $scope.envSubmiting = true;
            DomainSvc.addDomain($scope.domainEnvEntity, function (resp) {
              $scope.envSubmiting = false;
              var result = Constant.transformResponse(resp);
              if (!result) {
                $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                return;
              }
              $scope.addEnvErrorMsg = '';
              $scope.addInstanceDialog.close();
              $scope.domainDetail.envs.push(result);
            }, function (resp) {
              $scope.envSubmiting = false;
              $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
            });
      }

      $scope.getDetailInfo = function () {
        $scope.loadingStatus = Constant.loading;

        DomainSvc.getDomainById({domainId:$scope.paramDomainId}, function (resp) {
          var result = Constant.transformResponse(resp);
          if (result === undefined) {
            $scope.loadingStatus = Constant.loadError;
            return;
          }
          $scope.domainDetail = result;
          $scope.loadingStatus = null;
        }, function () {
          $scope.loadingStatus = Constant.loadError;
        });
      };

      $scope.getDetailInfo();

      // $scope.showAddDialog = function(){
      //   $scope.domainEntity = {
      //
      //   };
      //   $scope.submitErrorMsg = '';
      //   $scope.addInstanceDialog = ngDialog.open({
      //     template: './views/domain/domain-add.html',
      //     className: 'ngdialog-custom-default',
      //     scope: $scope
      //   });
      // }

      // $scope.confirmAdd = function () {
      //     $scope.submitErrorMsg = '';
      //     try{
      //       $scope.domainEntity.starDateTime = Utils.convertDateStr2Long($scope.range.starDateTime);
      //       $scope.domainEntity.endDateTime = Utils.convertDateStr2Long($scope.range.endDateTime);
      //     }catch(e){
      //       $scope.submitErrorMsg = '请输入有效的日期';
      //       return;
      //     }
      //     if($scope.domainEntity.starDateTime >= $scope.domainEntity.endDateTime){
      //       $scope.submitErrorMsg = '截止日期需大于开始日期';
      //       return;
      //     }
      //     if($scope.domainEntity.endDateTime < new Date().getTime()){
      //       $scope.submitErrorMsg = '截止日期需大于当前日期';
      //       return;
      //     }
      //     $scope.submiting = true;
      //     DomainSvc.addDomain($scope.domainEntity, function (resp) {
      //       $scope.submiting = false;
      //       var result = Constant.transformResponse(resp);
      //       if (!result) {
      //         $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
      //         return;
      //       }
      //       $scope.submitErrorMsg = '';
      //       $scope.loadingStatus = '';
      //       $scope.addInstanceDialog.close();
      //       $scope.domains.unshift(result);
      //     }, function (resp) {
      //       $scope.submiting = false;
      //       $scope.submitErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
      //     });
      //
      // };
  };

  return {
    name: "DomainDetailController",
    fn: ["$scope", "DomainSvc", "$cookies", "$routeParams", "UserSvc", "CommonSvc", 'ngDialog', DomainController]
  };


});
