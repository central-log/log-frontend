define(['utils/Constant','utils/Utils'], function (Constant, Utils) {
  var domainSelectedEnvKey ='domain-env-name';
  var domainSelectedTabKey ='env-tab-name';
  var DomainController = function (localStorageService, $scope, DomainSvc, $cookies, $routeParams, UserSvc, CommonSvc, ngDialog) {

      $scope.paramDomainId = $routeParams.domainId;
      $scope.envDetails = {};
      $scope.updateSelectedEnv = function (name) {
        localStorageService.set(domainSelectedEnvKey, name);
      }
      $scope.updateSelectedTab = function (tabName) {
        localStorageService.set(domainSelectedTabKey, tabName);
      }
      $scope.switchTab = function(tab){
        $scope.currentTab = tab;
        $scope.updateSelectedTab(tab);
      }

      var selectedTabName = localStorageService.get(domainSelectedTabKey);

      if(selectedTabName && selectedTabName!=='null' && selectedTabName!=='undefined'){
        $scope.switchTab(selectedTabName);
      }else{
        $scope.switchTab('basic');
      }
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

      $scope.showAddEnvDialog = function(isModify){
        $scope.isModify = isModify;
        if($scope.isModify){
          $scope.domainEnvEntity = {
            logLevel: $scope.envDetails.logLevel,
            description: $scope.envDetails.description,
            email: $scope.envDetails.email,
            name: $scope.envDetails.name
          };
        }else{
          $scope.domainEnvEntity = {
            logLevel: 'Log'
          };
        }
        $scope.addEnvErrorMsg = '';
        $scope.addEnvInstanceDialog = ngDialog.open({
          template: './views/domain/domain-env-add.html',
          className: 'ngdialog-custom-default',
          scope: $scope
        });
      }

      $scope.confirmEnvAdd = function () {
            $scope.domainEnvEntity.domainId = $scope.paramDomainId;
            $scope.domainEnvEntity.beforeName = $scope.envDetails.name;
            $scope.envSubmiting = true;
            if($scope.isModify){
              DomainSvc.modifyEnvDomain($scope.domainEnvEntity, function (resp) {
                $scope.envSubmiting = false;
                if (resp.errMsg) {
                  $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                  return;
                }
                $scope.addEnvErrorMsg = '';
                $scope.addEnvInstanceDialog.close();

                var index = -1, len;

                for(index = 0, len = $scope.domainDetail.env.length;index<len;index++){
                  if($scope.domainDetail.env[index].name === $scope.envDetails.name){
                    break;
                  }
                }
                $scope.domainDetail.env.splice(index, 1, $scope.domainEnvEntity);
                $scope.envDetails = $scope.domainEnvEntity;
              }, function (resp) {
                $scope.envSubmiting = false;
                $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
              });
            }else{
              DomainSvc.addEnvDomain($scope.domainEnvEntity, function (resp) {
                $scope.envSubmiting = false;
                if (resp.errMsg) {
                  $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                  return;
                }
                $scope.addEnvErrorMsg = '';
                $scope.addEnvInstanceDialog.close();
                if(!$scope.domainDetail.env){
                  $scope.domainDetail.env = [];
                }
                $scope.domainDetail.env.push($scope.domainEnvEntity);
              }, function (resp) {
                $scope.envSubmiting = false;
                $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
              });
            }
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
          if($scope.domainDetail && $scope.domainDetail.env){

            var previousSelectedEnv = localStorageService.get(domainSelectedEnvKey);
            var isSelectedBefore = previousSelectedEnv && previousSelectedEnv!=='null' && previousSelectedEnv!=='undefined';

            if(isSelectedBefore){
              $scope.envDetails = $scope.domainDetail.env.find(function(env){
                return env.name === previousSelectedEnv;
              });
            }

            if(!$scope.envDetails || !$scope.envDetails.name){
              $scope.envDetails = $scope.domainDetail.env[0];
              $scope.updateSelectedEnv($scope.envDetails.name);
            }

          }
          $scope.loadingStatus = null;
        }, function () {
          $scope.loadingStatus = Constant.loadError;
        });
      };

      $scope.getDetailInfo();
  };

  return {
    name: "DomainDetailController",
    fn: ["localStorageService", "$scope", "DomainSvc", "$cookies", "$routeParams", "UserSvc", "CommonSvc", 'ngDialog', DomainController]
  };


});
