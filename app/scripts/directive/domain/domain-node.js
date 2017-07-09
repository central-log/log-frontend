'use strict';
define(function () {
    function fn() {
        return {
            restrict: 'E',
            scope: {
                detail: '='
            },
            templateUrl: 'views/directive/domain/node.html',
            link: function (scope) {

            }
        };
    }

    return {
        name: 'domainNode',
        directiveFn: [fn]
    };
});
