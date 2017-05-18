
define(function () {
  return {
    generatorDropdown: function ($scope, name, items, defaultOpt) {
      $scope[name] = {};
      $scope[name].isOpen = false;
      $scope[name].items = items;
      $scope[name].selectOption = function (option) {
        $scope[name].option = option;
      };
      if (!defaultOpt && items.length) {
        $scope[name].option = items[0];
      } else {
        $scope[name].option = defaultOpt;
      }
    },
    // yyyy-MM-dd
    convertDateStr2Long: function(dateStr){
      var isValidStr = /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateStr);
      if(!isValidStr){
        throw new Error('invalid date');
      }
      var dates = dateStr.split('-');
      return new Date(dates[0], parseInt(dates[1])-1, dates[2]).getTime();
    },
    convertToArr: function (obj) {
      var result = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          result.push({
            name: obj[p],
            value: p
          });
        }
      }
      return result;
    },
    convertToMap: function (array) {
      var result = {};
      if (!array) {
        return result;
      }
      for (var i = 0, len = array.length; i < len; i++) {
        var obj = array[i];
        result[obj.value] = obj.name;
      }
      return result;
    }
  };
});
