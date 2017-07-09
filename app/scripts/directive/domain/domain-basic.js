'use strict';
define(['utils/Constant'], function (Constant) {
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

                $scope.confirmEnvAction = function (isDelete) {
                    $scope.domainEnvEntity.domainId = $scope.domainId;
                    $scope.envSubmiting = true;

                    var serviceName = isDelete ? 'deleteDomainEnv' : 'modifyEnvDomain';

                    DomainSvc[serviceName](isDelete ? {
                        domainId: $scope.domainId,
                        envId: $scope.domainEnvEntity.envId
                    } : $scope.domainEnvEntity, function () {
                        $scope.envSubmiting = false;
                        $scope.addEnvErrorMsg = '';
                        $scope.addEnvInstanceDialog.close();
                        window.location.reload();
                    }, function (error) {
                        var resp = (error && error.data) || {};

                        $scope.envSubmiting = false;
                        $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
                    });
                };

                $scope.showAddEnvDialog = function (isModify) {
                    $scope.isModify = isModify;

                    $scope.domainEnvEntity = {
                        logLevel: $scope.envDetails.logLevel,
                        description: $scope.envDetails.description,
                        email: $scope.envDetails.email,
                        name: $scope.envDetails.name,
                        envId: $scope.envDetails.id
                    };

                    $scope.addEnvErrorMsg = '';
                    $scope.addEnvInstanceDialog = ngDialog.open({
                        template: './views/domain/domain-env-add.html',
                        className: 'ngdialog-custom-default',
                        scope: $scope
                    });
                };

            }
        };
    }

    return {
        name: 'domainBasic',
        directiveFn: ['DomainSvc', 'ngDialog', fn]
    };
});
