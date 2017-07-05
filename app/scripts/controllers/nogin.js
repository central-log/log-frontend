define(['utils/Constant'], function (Constant) {
    var LoginController = function ($scope, $log, ActorSvc, CommonSvc, $cookies, $location, $rootScope, $timeout, localStorageService, $interval) {
        $scope.apiBase = Constant.apiBase;
        $scope.name = 'LoginController';
        $scope.emailCaptchaButtonEnable = true;
        $scope.buttonContent = '获取验证码';

        $scope.count = 0;
        $scope.loginFailed = false;
        $scope.resetPwdStep1 = true;
        $scope.resetPwdStep2 = false;
        $scope.resetPwdStep3 = false;
        $scope.resetPwdStep4 = false;
        $scope.remPwd = false;
        $scope.resetPwd1 = '';
        $scope.resetPwd2 = '';

        $scope.submit = function () {
            if (!$scope.username || !$scope.password) {
                $scope.loginAlertContent = '请输入完整用户名和密码';
                return;
            }
            ActorSvc.login({
                username: $scope.username,
                password: $scope.password
            }, function (response) {
                $rootScope.userInfo = response;
                $scope.loginAlertContent = null;

                $location.url('/domain');
            }, function () {
                $scope.loginAlertContent = '服务器异常';
            });

        };

        $scope.resetPwdEmail = '';
        $scope.resetPwdAlertContent = '';
        $scope.resetPwdFailed = false;

        $scope.submitResetPwd = function () {
            ActorSvc.verifyCaptcha({
                captcha: $scope.resetPwdCaptcha
            }, function (response) {
                if (response.respCode === '_200') {
                    $scope.resetPwdFailed = false;
                    $scope.resetPwdStep1 = false;
                    $scope.resetPwdStep2 = true;
                    $scope.resetPwdStep3 = false;
                    $scope.resetPwdStep4 = false;
                } else if (response.respCode === '_400') {
                    $scope.resetPwdAlertContent = response.errMsg;
                    $scope.resetPwdFailed = true;
                }
            }, function () {
                $scope.resetPwdAlertContent = '您输入的验证码有误';
                $scope.resetPwdFailed = true;
            });
        };

        $scope.isSubmitResetPwdEnable = function () {
            var myRegExp = /[a-z0-9-]{1,30}@[a-z0-9-]{1,65}.[a-z]{3}/;

            if (!myRegExp.test($scope.resetPwdEmail)) {
                return true;
            } else if (!$scope.resetPwdCaptcha) {
                return true;
            } else {
                return false;
            }

        };

        $scope.count = 60;
        $scope.buttonTimer = false;

        $scope.sendEmailCaptchaMsg = '';
        $scope.sendCaptchaToEmail = function () {
            ActorSvc.sendCaptchaToEmail({
                email: $scope.resetPwdEmail
            }, function (result) {
                if (result && '_200' === result.respCode) {
                    $scope.buttonTimer = true;
                    $scope.sendEmailCaptchaMsg = '已发送您邮箱' + $scope.resetPwdEmail;
                    $scope.emailCaptchaButtonEnable = false;
                    var interv = $interval(function () {
                        $scope.count--;
                        if ($scope.count === 0) {
                            $scope.count = 60;
                            $scope.emailCaptchaButtonEnable = true;
                            $scope.buttonTimer = false;
                            $interval.cancel(interv);
                        }
                    }, 1000);
                } else {
                    $scope.sendEmailCaptchaMsg = (result.errMsg ? result.errMsg : '验证码发送失败');
                }
            }, function () {
                $scope.sendEmailCaptchaMsg = '验证码发送失败';
            });
        };

        $scope.verifyEmailCaptchaDisabled = function () {
            if ($scope.emailCaptcha) {
                return false;
            } else {
                return true;
            }
        };

        $scope.finalResetPwdDisabled = function () {
            if ($scope.resetPwd1 && $scope.resetPwd2) {
                return false;
            } else {
                return true;
            }
        };

        $scope.verifyEmailCaptcha = function () {
            if (!$scope.emailCaptcha) {
                $scope.resetPwdAlertContent = '验证码不能为空';
                $scope.resetPwdFailed = true;
            }

            ActorSvc.verifyEmailCaptcha({
                emailCaptcha: $scope.emailCaptcha
            }, function (response) {
                if (response.respCode === '_200') {
                    $scope.resetPwdFailed = false;
                    $scope.resetPwdStep1 = false;
                    $scope.resetPwdStep2 = false;
                    $scope.resetPwdStep3 = true;
                    $scope.resetPwdStep4 = false;

                } else {
                    $scope.resetPwdAlertContent = response.errMsg;
                    $scope.resetPwdFailed = true;
                }
            }, function () {});
        };

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

        $scope.finalResetPwd = function () {
            if (!$scope.resetPwd1 || !$scope.resetPwd2) {
                $scope.resetPwdAlertContent = '密码不能为空';
                $scope.resetPwdFailed = true;
            } else if ($scope.resetPwd1 !== $scope.resetPwd2) {
                $scope.resetPwdAlertContent = '两次密码输入不一致！';
                $scope.resetPwdFailed = true;
            } else {
                if ($scope.passwordVerify($scope.resetPwd1)) {
                    ActorSvc.resetPwd({
                        emailOrPhone: $scope.resetPwdEmail,
                        newPassword: $scope.resetPwd1
                    }, function (result) {
                        if (result.respCode === '_200') {
                            $scope.resetPwdFailed = false;
                            $scope.resetPwdStep1 = false;
                            $scope.resetPwdStep2 = false;
                            $scope.resetPwdStep3 = false;
                            $scope.resetPwdStep4 = true;
                        } else {
                            $scope.resetPwdAlertContent = result.errMsg;
                            $scope.resetPwdFailed = true;
                        }
                    }, function () {});
                } else {
                    $scope.resetPwdAlertContent = '至少8个字符，其中包括至少一个大写字母、一个小写字母、一个数字和一个特殊字符';
                    $scope.resetPwdFailed = true;
                }
            }
        };

        $scope.relogin = function () {
            $location.url('/login');
        };

        $scope.refreshCaptcha = function () {
            document.getElementById('captcha').src = $scope.apiBase + '/common/getCaptcha?v' + Math.random();
        };

    };

    return {
        name: 'LoginController',
        fn: ['$scope', '$log', 'ActorSvc', 'CommonSvc', '$cookies', '$location', '$rootScope', '$timeout', 'localStorageService', '$interval', LoginController]
    };


});
