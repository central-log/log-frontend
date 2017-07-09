'use strict';
/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(function () {
  /**
   * A module representing a login controller.
   * @exports controllers/login
   */
    var AccountController = function ($scope, $log, AccountSvc, $cookies, $location, $rootScope) {
    // … other code here
        $scope.title = '修改密码';
        $scope.newPassword1 = '';
        $scope.newPassword2 = '';
        $scope.oldPassword = '';

        $scope.passwordVerify = function (pwd) {
            var special = 0;
            var digit = 0;
            var uletter = 0;
            var lletter = 0;

            for (var i = pwd.length - 1; i >= 0; i--) {
                if (pwd.charAt(i).charCodeAt() >= 97 && pwd.charAt(i).charCodeAt() <= 122) {
                    lletter++;
                } else if (pwd.charAt(i).charCodeAt() >= 65 && pwd.charAt(i).charCodeAt() <= 90) {
                    uletter++;
                } else if (pwd.charAt(i).charCodeAt() >= 48 && pwd.charAt(i).charCodeAt() <= 57) {
                    digit++;
                } else if (pwd.charAt(i) === '@' || pwd.charAt(i) === '!' || pwd.charAt(i) === '#' || pwd.charAt(i) === '$' || pwd.charAt(i) === '&') {
                    special++;
                }
            }
            if (special > 0 && digit > 0 && uletter > 0 && lletter > 0 && pwd.length >= 8) {
                return true;
            } else {
                return false;
            }
        };

        $scope.submitModifyPwdDisabled = function () {
            if ($scope.newPassword1 && $scope.newPassword2 && $scope.oldPassword) {
                return false;
            } else {
                return true;
            }
        };

        $scope.resetPwdAlertContent = '';
        $scope.resetPwdFailed = false;

        $scope.submitModifyPwd = function () {
            if ($scope.newPassword1 !== $scope.newPassword2) {
                $scope.resetPwdAlertContent = '两次密码输入不一致';
                $scope.resetPwdFailed = true;
            } else if (!$scope.newPassword1 || !$scope.newPassword2 || !$scope.oldPassword) {
                $scope.resetPwdAlertContent = '密码不能为空';
                $scope.resetPwdFailed = true;
            } else {
                if ($scope.passwordVerify($scope.newPassword1)) {
                    AccountSvc.modifyPwd({
                        newpassword: $scope.newPassword1,
                        oldpassword: $scope.oldPassword
                    }, function (result) {
                        if (result.respCode === '_302') {
                            window.location = result.result;
                        } else if (result.respCode === '_200') {
                            $rootScope.setCookieUsername('');
                            $location.url('/login');
                        } else if (result.respCode !== '_200') {
                            $scope.resetPwdAlertContent = result.errMsg ? result.errMsg : '重置密码失败';
                            $scope.resetPwdFailed = true;
                        }
                    }, function () {
                        $scope.resetPwdAlertContent = '重置密码失败';
                        $scope.resetPwdFailed = true;
                    });
                } else {
                    $scope.resetPwdAlertContent = '至少8个字符，其中包括至少一个大写字母、一个小写字母、一个数字和一个特殊字符（为!、@、#、$和&）';
                    $scope.resetPwdFailed = true;
                }
            }
        };

    };

    return {
        name: 'AccountController',
        fn: ['$scope', '$log', 'AccountSvc', '$cookies', '$location', '$rootScope', AccountController]
    };


});
