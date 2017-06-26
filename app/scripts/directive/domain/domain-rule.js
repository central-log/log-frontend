define(function () {
  function fn() {
    return {
      restrict: 'E',
      scope: {
        detail: '='
      },
      templateUrl: 'views/directive/domain/rule.html',
      link: function (scope) {

      }
    };
  }

  return {
    name: 'domainRule',
    directiveFn: [fn]
  };
});
