define(function () {
  function fn() {
    return {
      restrict: 'E',
      scope: {
        detail: '='
      },
      templateUrl: 'views/directive/domain/user.html',
      link: function (scope) {

      }
    };
  }

  return {
    name: 'domainUser',
    directiveFn: [fn]
  };
});
