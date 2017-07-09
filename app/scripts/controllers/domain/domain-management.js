'use strict';
define(['utils/Constant'], function (Constant) {

    var Controller = function ($scope, UserSvc, DomainSvc, $routeParams, GroupSvc, CommonSvc, RoleSvc) {
        $scope.pagination = {
            pageSize: Constant.pageSize,
            curPage: 1,
            totalCount: 0
        };
        $scope.roleTypes = Constant.roleTypesArr;
    // Search User
        $scope.criteria = {
            roleType: $scope.roleTypes[0]
        };

        var dt = new Date();

        $scope.defaultHolder = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();

        function generatorDropdown(name, items, defaultOpt) {
            $scope[name] = {};
            $scope[name].isOpen = false;
            if (!defaultOpt) {
                $scope[name].option = items[0];
            } else {
                $scope[name].option = defaultOpt;
            }
            $scope[name].selectOption = function (option) {
                $scope[name].option = option;
            };
            $scope[name].items = items;
        }

        $scope.enables = [{
            name: '请选择',
            value: ''
        }, {
            name: '是',
            value: 0
        }, {
            name: '否',
            value: 1
        }];
        generatorDropdown('roleTypeDropdown', $scope.roleTypes);
        generatorDropdown('statusDropdown', $scope.enables);

        function getProvince() {
            CommonSvc.getProvince({}, function (resp) {
                $scope.provinces = resp.result.map(function (data) {
                    return {
                        name: data,
                        value: data
                    };
                });
                $scope.provinces.unshift({
                    name: '请选择',
                    value: ''
                });
                generatorDropdown('provinceDropdown', $scope.provinces);
            });
        }
        getProvince();
        $scope.$watch('provinceDropdown.option', function () {
            if (!$scope.provinceDropdown || !$scope.provinceDropdown.option.value) {
                return;
            }
            generatorDropdown('disctrictDropdown', [{
                name: '请选择',
                value: ''
            }]);
            getCity($scope.provinceDropdown.option.value);
        });
        $scope.$watch('cityDropdown.option', function () {
            if (!$scope.cityDropdown || !$scope.cityDropdown.option.value) {
                return;
            }
            getDistrict($scope.cityDropdown.option.value);
        });

        function getDistrict(provinceId) {
            CommonSvc.getDistrict({
                area: provinceId
            }, function (resp) {
                $scope.disctricts = resp.result.map(function (data) {
                    return {
                        name: data,
                        value: data
                    };
                });
                $scope.disctricts.unshift({
                    name: '请选择',
                    value: ''
                });
                generatorDropdown('disctrictDropdown', $scope.disctricts);
            });
        }

        function getCity(provinceId) {
            CommonSvc.getCity({
                area: provinceId
            }, function (resp) {
                $scope.cities = resp.result.map(function (data) {
                    return {
                        name: data,
                        value: data
                    };
                });
                $scope.cities.unshift({
                    name: '请选择',
                    value: ''
                });
                generatorDropdown('cityDropdown', $scope.cities);
            });
        }
        $scope.getGroups = function () {
            GroupSvc.getGroups({
        // get all groups
                pageSize: Constant.hackMaxPageSize,
                page: 1
            }, function (resp) {
                $scope.groups = resp.result.data.map(function (data) {
                    var group = {};

                    group.id = data.id;
                    group.name = data.name;
                    return group;
                });
                $scope.groups.unshift({
                    name: '请选择',
                    id: ''
                });
                generatorDropdown('groupDropdown', $scope.groups);
            });
        };
        $scope.getGroups();
        $scope.convertToDate = function (val) {
            if (!val) {
                return null;
            }
            try {
                var res = val.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);

                if (res.length === 4) {
                    var dt = new Date();

                    dt.setFullYear(res[1]);
                    var year = parseInt(res[2]) - 1;

                    year = year > 12 ? 12 : year;
                    dt.setMonth(parseInt(year));
                    var day = parseInt(res[3]);

                    day = day > 31 ? 31 : day;
                    dt.setDate(day);
                    return dt.getTime();
                }
                return null;
            } catch (e) {
                return null;
            }

        };
        $scope.searchUsers = function () {
            var searchCriteria = {
                page: $scope.pagination.curPage,
                pageSize: $scope.pagination.pageSize,
                name: $scope.criteria.name ? $scope.criteria.name : null,
                email: $scope.criteria.email ? $scope.criteria.email : null,
                phone: $scope.criteria.phone ? $scope.criteria.phone : null,
                createDate: $scope.criteria.createDate ? $scope.convertToDate($scope.criteria.createDate) : null,
                province: $scope.userQuery ? $scope.userQuery.province : null,
                district: $scope.userQuery ? $scope.userQuery.district : null,
                city: $scope.userQuery ? $scope.userQuery.city : null,
                groupId: $scope.groupDropdown.option ? ($scope.groupDropdown.option.id ? $scope.groupDropdown.option.id : null) : null,
                roleType: $scope.roleTypeDropdown.option ? ($scope.roleTypeDropdown.option.value ? $scope.roleTypeDropdown.option.value : null) : null,
                status: $scope.statusDropdown.option ? (($scope.statusDropdown.option.value === 0 || $scope.statusDropdown.option.value === 1) ? $scope.statusDropdown.option.value : null) : null
            };

            $scope.loadingStatus = Constant.loading;
            $scope.searchRslt = [];
            UserSvc.getUsers(searchCriteria, function (resp) {
                var result = Constant.transformResponse(resp);

                if (result === undefined) {
                    $scope.loadingStatus = Constant.loadError;
                    return;
                }
                if (!result || !result.data || !result.data.length) {
                    $scope.loadingStatus = Constant.loadEmpty;
                    return;
                }
                $scope.loadingStatus = '';
                $scope.searchRslt = resp.result.data.map(function (user) {
                    user.selected = false;
                    return user;
                });
                $scope.pagination.curPage = resp.result.page;
                $scope.pagination.totalCount = resp.result.totalCount;
                $scope.pagination.pageSize = resp.result.pageSize;
            }, function () {
                $scope.loadingStatus = Constant.loadError;
            });
        };

        $scope.domainId = $routeParams.domainId;
        $scope.paramRoleId = $routeParams.roleId;
    // Bind User
        $scope.bindList = [];
        $scope.toggleSelectAll = function (selectAll) {
            if (!selectAll) {
                $scope.searchRslt.map(function (user) {
                    user.selected = true;
                    return user;
                });
                $scope.bindList = $scope.searchRslt.map(function (user) {
                    return user.id;
                });
            } else {
                $scope.searchRslt.map(function (user) {
                    user.selected = false;
                    return user;
                });
                $scope.bindList = [];
            }
        };

        $scope.toggleUser = function (user) {
            user.selected = !user.selected;
            var i, len = $scope.bindList.length;

            for (i = 0; i < len; i++) {
                if ($scope.bindList[i] === user.id) {
                    $scope.bindList.splice(i, 1);
                    break;
                }
            }
            if (i === len) {
                $scope.bindList.push(user.id);
            }
        };
        $scope.bindResult = '';
        $scope.bindRole = function () {
            $scope.bindResult = '';
            if (!$scope.bindList.length) {
                return;
            }
            RoleSvc.addRoleUsers({
                roleId: $routeParams.roleId,
                userIds: $scope.bindList.join(',')
            }, function () {
                $scope.bindResult = 'success';
            }, function () {
                $scope.bindResult = 'failed';
            });
        };
        $scope.bindUser = function () {
            $scope.bindResult = 'success';
            if (!$scope.bindList.length) {
                return;
            }
            DomainSvc.addDomainUsers({
                domainId: $scope.domainId,
                userIds: $scope.bindList.join(',')
            }, function () {
                $scope.bindResult = 'success';
                $scope.searchUsers();
            }, function () {
                $scope.bindResult = 'failed';
            });
        };
    };

    return {
        name: 'UserBindManagementController',
        fn: ['$scope', 'UserSvc', 'DomainSvc', '$routeParams', 'GroupSvc', 'CommonSvc', 'RoleSvc', Controller]
    };


});
