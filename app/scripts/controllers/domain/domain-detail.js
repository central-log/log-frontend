'use strict';
define(['utils/Constant'], function (Constant) {
    var domainSelectedEnvKey = 'domain-env-name';
    var domainSelectedTabKey = 'env-tab-name';
    var DomainController = function (localStorageService, $scope, DomainSvc, $routeParams, ngDialog) {

        $scope.paramDomainId = $routeParams.domainId;
        $scope.envDetails = {};
        $scope.updateSelectedEnv = function (name, refresh) {
            localStorageService.set(domainSelectedEnvKey, name);
            if (refresh) {
                window.location.reload();
            }
        };
        $scope.updateSelectedTab = function (tabName) {
            localStorageService.set(domainSelectedTabKey, tabName);
        };
        $scope.switchTab = function (tab) {
            $scope.currentTab = tab;
            $scope.updateSelectedTab(tab);
        };

        var selectedTabName = localStorageService.get(domainSelectedTabKey);

        if (selectedTabName && selectedTabName !== 'null' && selectedTabName !== 'undefined') {
            $scope.switchTab(selectedTabName);
        } else {
            $scope.switchTab('basic');
        }

        $scope.logLevels = Constant.logLevels;

        $scope.showAddEnvDialog = function (isModify) {
            $scope.isModify = isModify;

            $scope.domainEnvEntity = {
                logLevel: 'Log'
            };

            $scope.addEnvErrorMsg = '';
            $scope.addEnvInstanceDialog = ngDialog.open({
                template: './views/domain/domain-env-add.html',
                className: 'ngdialog-custom-default',
                scope: $scope
            });
        };

        $scope.confirmEnvAction = function () {
            $scope.domainEnvEntity.domainId = $scope.paramDomainId;
            $scope.envSubmiting = true;
            $scope.addEnvErrorMsg = '';
            DomainSvc.addEnvDomain($scope.domainEnvEntity, function () {
                $scope.envSubmiting = false;

                $scope.addEnvErrorMsg = '';
                $scope.addEnvInstanceDialog.close();

                $scope.updateSelectedTab('basic');
                $scope.updateSelectedEnv($scope.domainEnvEntity.name, true);
            }, function (error) {
                var resp = (error && error.data) || {};

                $scope.envSubmiting = false;
                $scope.addEnvErrorMsg = resp.errMsg ? resp.errMsg : Constant.createError;
            });
        };

        $scope.getDetailInfo = function () {
            DomainSvc.getDomainById({ domainId: $scope.paramDomainId }, function (resp) {
                var previousSelectedEnv, isSelectedBefore;

                $scope.domainDetail = resp;
                if (!resp.id) {
                    $scope.notFound = true;
                    return;
                }
                if ($scope.domainDetail && $scope.domainDetail.env) {

                    previousSelectedEnv = localStorageService.get(domainSelectedEnvKey);
                    isSelectedBefore = previousSelectedEnv && previousSelectedEnv !== 'null' && previousSelectedEnv !== 'undefined';

                    if (isSelectedBefore) {
                        $scope.envDetails = $scope.domainDetail.env.find(function (env) {
                            return env.name === previousSelectedEnv;
                        });
                    }

                    if (!$scope.envDetails || !$scope.envDetails.name) {
                        $scope.envDetails = $scope.domainDetail.env[0];
                        $scope.updateSelectedEnv($scope.envDetails.name);
                    }

                }
            }, function () {
                $scope.domainDetail = null;
                $scope.serverError = true;
            });
        };

        $scope.getDetailInfo();
    };

    return {
        name: 'DomainDetailController',
        fn: ['localStorageService', '$scope', 'DomainSvc', '$routeParams', 'ngDialog', DomainController]
    };


});
