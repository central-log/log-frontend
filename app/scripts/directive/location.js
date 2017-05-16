'use strict';
define(function () {
  var directive = function (CommonSvc) {
    return {
      restrict: 'E',
      templateUrl: 'views/directive/location.html',
      scope: {
        province: '=',
        city: '=',
        district: '='
      },
      link: function ($scope) {
        $scope.$watch('province', function (newVal) {
          if (!newVal) {
            $scope.city = null;
            $scope.cityList = ['请选择'];
            return false;
          }

          CommonSvc.getCity({
            area: $scope.province
          }, function (res) {
            $scope.cityList = res.result;
            $scope.cityList.unshift('请选择');
            if ($scope.city) {
              for (var i = 0, len = $scope.cityList.length; i < len; i++) {
                if ($scope.city === $scope.cityList[i]) {
                  $scope.city = $scope.cityList[i];
                  break;
                }
              }
              if (i >= len) {
                $scope.city = null;
                $scope.district = null;
              }
            } else {
              $scope.city = null;
              $scope.district = null;
            }
          });
        });

        $scope.$watch('city', function (newVal) {
          if (!newVal) {
            $scope.district = null;
            $scope.districtList = ['请选择'];
            return false;
          }

          CommonSvc.getDistrict({
            area: $scope.city
          }, function (res) {
            $scope.districtList = res.result;
            $scope.districtList.unshift('请选择');
            if ($scope.district) {
              for (var i = 0, len = $scope.districtList.length; i < len; i++) {
                if ($scope.district === $scope.districtList[i]) {
                  $scope.district = $scope.districtList[i];
                  break;
                }
              }
              if (i >= len) {
                $scope.district = null;
              }
            } else {
              $scope.district = null;
            }
          });
        });
        $scope.selectOption = function (prop, value) {
          $scope[prop] = (value === '请选择' ? null : value);
        };

        CommonSvc.getProvince(function (res) {
          $scope.provinceList = res.result;
          $scope.provinceList.unshift('请选择');
        });
      }
    };
  };
  return {
    name: 'location',
    directiveFn: ['CommonSvc', directive]
  };
});
