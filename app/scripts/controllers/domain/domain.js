define(['utils/Constant', 'utils/Utils'], function (Constant, Utils) {

    var DomainController = function ($scope, DomainSvc, $routeParams, ngDialog) {

        $scope.criteria = {
            name: ''
        };
        $scope.range = {};
        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
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
                if (!resp || !resp.data || !resp.data.length) {
                    $scope.domains = [];
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }

                $scope.loadingStatus = '';
                $scope.domains = resp.data;

                $scope.pagination.curPage = resp.page;
                $scope.pagination.totalCount = resp.totalCount;
                $scope.pagination.pageSize = resp.pageSize;

            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };

        $scope.onsearch();

        $scope.showAddDialog = function () {
            $scope.domainEntity = {

            };
            $scope.submitErrorMsg = '';
            $scope.addInstanceDialog = ngDialog.open({
                template: './views/domain/domain-add.html',
                className: 'ngdialog-custom-default',
                scope: $scope
            });
        };

        $scope.confirmAdd = function () {
            $scope.submitErrorMsg = '';
            try {
                $scope.domainEntity.starDateTime = Utils.convertDateStr2Long($scope.range.starDateTime);
                $scope.domainEntity.endDateTime = Utils.convertDateStr2Long($scope.range.endDateTime);
            } catch (e) {
                $scope.submitErrorMsg = '请输入有效的日期';
                return;
            }
            if ($scope.domainEntity.starDateTime >= $scope.domainEntity.endDateTime) {
                $scope.submitErrorMsg = '截止日期需不能早于开始日期';
                return;
            }
            if ($scope.domainEntity.endDateTime < new Date().getTime()) {
                $scope.submitErrorMsg = '截止日期需大于当前日期';
                return;
            }
            $scope.submiting = true;
            DomainSvc.addDomain($scope.domainEntity, function (resp) {
                $scope.submiting = false;

                $scope.submitErrorMsg = '';
                $scope.loadingStatus = '';
                $scope.addInstanceDialog.close();
                $scope.domains.unshift(resp);
            }, function (error) {
                var resp = error.data;

                $scope.submiting = false;
                $scope.submitErrorMsg = (resp && resp.errMsg) ? resp.errMsg : Constant.createError;
            });
        };

    };

    return {
        name: 'DomainController',
        fn: ['$scope', 'DomainSvc', '$routeParams', 'ngDialog', DomainController]
    };
});
