'use strict';
define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/common/:catalog', null, {
            sendCaptchaToEmail: {
                method: 'GET',
                params: {
                    catalog: 'sendCaptchaToEmail'
                },
        // isArray: false,
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },
            login: {
                method: 'POST',
                params: {
                    catalog: 'loginPwd'
                },
        // isArray: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest: function (data) {
                    var str = [];

                    for (var d in data) {
                        str.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                    }
                    return str.join('&');
                },
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },

            loginTk: {
                method: 'GET',
                params: {
                    catalog: 'loginTk'
                },
        // isArray: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest: function (data) {
                    var str = [];

                    for (var d in data) {
                        str.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                    }
                    return str.join('&');
                },
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },

            getCaptcha: {
                method: 'GET',
                params: {
                    catalog: 'getCaptcha'
                },
        // isArray: false,
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },

            verifyEmailCaptcha: {
                method: 'GET',
                params: {
                    catalog: 'verifyEmailCaptcha'
                },
        // isArray: false,
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },

            verifyCaptcha: {
                method: 'GET',
                params: {
                    catalog: 'verifyCaptcha'
                },
                isArray: false,
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            },

            resetPwd: {
                method: 'POST',
                params: {
                    catalog: 'resetPwd'
                },
        // isArray: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest: function (data) {
                    var str = [];

                    for (var d in data) {
                        str.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                    }
                    return str.join('&');
                },
                timeout: Constant.reqTimeout,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;

                        result.$status = response.status;
                        return result;
                    }
                }
            }
        });

        return svc;
    };

    return {
        name: 'LoginSvc',
        svc: ['$resource', Service]
    };


});
