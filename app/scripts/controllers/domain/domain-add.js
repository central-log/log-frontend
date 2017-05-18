/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(['utils/Constant'], function (Constant) {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */

  var DomainController = function ($scope, DomainSvc) {
    $scope.loadingStatus = null;
    $scope.showConfirmDialog = function(){

    }

    $scope.confirmAddDoamin = function(){
      DomainSvc.addDomain($scope.domainEntity, function(resp){
        var result = Constant.transformResponse(resp);
        if (result === undefined) {
          $scope.loadingStatus = Constant.loadError;
          return;
        }
        $scope.addedDomain = result;
      }, function(){
        $scope.loadingStatus = Constant.loadError;
      })
    }
  };

  return {
    name: "DomainAddController",
    fn: ["$scope", "DomainSvc", DomainController]
  };


});
