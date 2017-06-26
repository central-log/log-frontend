define(function () {
  function fn() {
    return {
      restrict: 'E',
      scope: {
        detail: '='
      },
      templateUrl: 'views/directive/domain/basic.html',
      link: function (scope) {

      }
    };
  }

  return {
    name: 'domainBasic',
    directiveFn: [fn]
  };
});
