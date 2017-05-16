'use strict';
define(function () {
  function fn() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/directive/location.html'
    };
  }
  return {
    name: 'loc',
    fn: fn
  };
});
