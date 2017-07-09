'use strict';
define(function () {
    var MainController = function ($scope, $log, LogoutSvc, $cookies, $location, $rootScope) {
        $rootScope.pageLoaded = true;
    // … other code here
        $rootScope.logout = function () {
            LogoutSvc.logout(function (response) {
                $rootScope.setCookieUsername('');
                if (response && response.result) {
                    window.location.href = response.result;
                } else {
                    $location.url('/login');
                }
        // $location.url(response.redirectURL);
            }, function () {
                $rootScope.setCookieUsername('');
                $location.url('/login');
            });
        };
        $rootScope.setting = function () {
            $location.url('/account');
        };
        $scope.getUserName = function () {
            return $rootScope.getCookieUsername();
        };
        $scope.isShowTopBar = function () {
      // hide header in login page
            return !!$rootScope.getCookieUsername() && ($location.path().indexOf('/login') !== 0);
        };
        $scope.hideContent = function () {
      // wether hiden page content
            return !$rootScope.getCookieUsername() && ($location.path().indexOf('/login') !== 0);
        };
        $rootScope.setCookieUsername = function (username) {
            $cookies[window.location.hostname + '/' + 'Techops'] = username;
        };
        $rootScope.getCookieUsername = function () {
            return $cookies[window.location.hostname + '/' + 'Techops'];
        };
    };

    return {
        name: 'MainController',
        fn: ['$scope', '$log', 'LogoutSvc', '$cookies', '$location', '$rootScope', MainController]
    };


});
