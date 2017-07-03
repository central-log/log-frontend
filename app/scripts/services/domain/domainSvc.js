define(['utils/Constant'], function (Constant) {
    var Service = function ($resource) {
        var svc = $resource(Constant.apiBase + '/domain/:domainId/:catalog/:envId', null, {

            queryDomain: {
                method: 'GET',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addEnvDomain: {
                method: 'PUT',
                params: {
                    domainId: '@domainId',
                    catalog: 'env'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            modifyEnvDomain: {
                method: 'POST',
                params: {
                    domainId: '@domainId',
                    catalog: 'env',
                    envId: '@envId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            deleteDomainEnv: {
                method: 'DELETE',
                params: {
                    domainId: '@domainId',
                    catalog: 'env',
                    envId: '@envId'
                },
                isArray: false,
                timeout: Constant.reqTimeout
            },
            addDomain: {
                method: 'PUT',
                isArray: false,
                timeout: Constant.reqTimeout
            },
            getDomainById: {
                method: 'GET',
                params: {
                    domainId: '@domainId'
                },
                timeout: Constant.reqTimeout
            }
        });

        return svc;
    };

    return {
        name: 'DomainSvc',
        svc: ['$resource', Service]
    };


});
