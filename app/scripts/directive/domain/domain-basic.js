define(['utils/Constant','utils/Utils'],function (Constant, Utils) {
  function fn(DomainSvc, ngDialog) {
    return {
      restrict: 'E',
      scope: {
        envDetails: '=',
        domainId: '='
      },
      templateUrl: 'views/directive/domain/basic.html',
      link: function ($scope) {
        $scope.logLevels = Constant.logLevels;

        $scope.confirmEnvAdd = function () {
              $scope.domainEnvEntity.domainId = $scope.domainId;
              $scope.domainEnvEntity.beforeName = $scope.envDetails.name;
              $scope.envSubmiting = true;

              DomainSvc.modifyEnvDomain($scope.domainEnvEntity, function (resp) {
                $scope.envSubmiting = false;
                if (resp.errMsg) {
                  $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                  return;
                }
                $scope.addEnvErrorMsg = '';
                $scope.addEnvInstanceDialog.close();
                window.location.reload();
              }, function (resp) {
                $scope.envSubmiting = false;
                $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
              });
        }

        $scope.showAddEnvDialog = function(isModify){
          $scope.isModify = isModify;

          $scope.domainEnvEntity = {
            logLevel: $scope.envDetails.logLevel,
            description: $scope.envDetails.description,
            email: $scope.envDetails.email,
            name: $scope.envDetails.name
          };

          $scope.addEnvErrorMsg = '';
          $scope.addEnvInstanceDialog = ngDialog.open({
            template: './views/domain/domain-env-add.html',
            className: 'ngdialog-custom-default',
            scope: $scope
          });
        }

      }
    };
  }

  return {
    name: 'domainBasic',
    directiveFn: ['DomainSvc', 'ngDialog', fn]
  };
});
