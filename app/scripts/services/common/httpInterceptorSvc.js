'use strict';
define([], function () {
    var Service = function ($q, $location) {
        var responseError = function (rejection) {
            if (rejection.status === 403) {
                $location.url('/403');
            }
            return $q.reject(rejection);
        };
        var response = function (response) {
            var data = null;

            if (response) {
                data = response.data;
                if (data && data.respCode) {
                    if (data.respCode === '_302') {
            // logout
                        var url = '';

                        if (data.result) {
                            if (data.result.gotoUrl) {
                                url = data.result.gotoUrl;
                            } else {
                                url = data.result;
                            }
                            if (url.indexOf('/login')) {
                // $rootScope.setCookieUsername('');
                            }
                            window.location = url;
                        }
                    } else if (data.respCode === '_403') {
                        $location.url('/403');
                    }
                }
            }
            return response;
        };

        return {
            responseError: responseError,
            response: response
        };
    };

    return {
        name: 'httpInterceptorSvc',
        svc: ['$q', '$location', Service]
    };


});
