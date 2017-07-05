define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/actor/:domainId/:catalog/:envId', null, {

            login: {
                method: 'POST',
                isArray: false,
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'ActorSvc',
        svc: ['$resource', Service]
    };


});
