'use strict';
define(['utils/Constant'], function (Constant) {
  var Service = function ($resource, CommonSvc, $q) {

    var svc = {
      getGroupTypes: function () {
        var deferred = $q.defer();
        CommonSvc.getGroupTypes(null, function (resp) {
          var types = Constant.transformResponse(resp);
          if (!types) {
            deferred.reject(null);
            return;
          }
          deferred.resolve(types);
        }, function () {
          deferred.reject(null);
        });
        return deferred.promise;
      }
    };
    return svc;
  };

  return {
    name: "Common",
    svc: ["$resource", "CommonSvc", "$q", Service]
  };

});
