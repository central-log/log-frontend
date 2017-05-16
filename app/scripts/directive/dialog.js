'use strict';
define(['utils/Constant'], function (Constant) {
  function fn() {
    return {
      restrict: 'E',
      scope: {
        dialog: '='

        /**
          $scope.menuDialog = {
              title: '',
              description: '',
              requestSender: {
                method: RoleSvc.removeRoleMenus,
                params: function(){
                    roleId: $routeParams.roleId,
                    menuIds: this.actionId
                  }
                },
                success: function(resp){
                  $scope.getRoleUsers();
                },
                error: function(){

                }
              },
              beforeOpen: function(){

              },
              afterClose: function(){

              },
              //optional
              errorMsg: '',
              closeText: ''
          }
        */
      },
      transclude: true,
      templateUrl: 'views/directive/dialog.html',
      link: function (scope) {
        if (!scope.dialog.closeText) {
          scope.dialog.closeText = '关闭';
        }
        if (!scope.dialog.errorMsg) {
          scope.dialog.errorMsg = '操作失败，请稍后重试';
        }
        scope.dialog.open = function (actionId) {
          this.isOpen = true;
          this.submiting = '';
          this.actionId = actionId;
          this.isError = false;
          if (typeof scope.dialog.beforeOpen === 'function') {
            scope.dialog.beforeOpen();
          }
        };
        scope.dialog.close = function () {
          this.isOpen = false;
          if (typeof scope.dialog.afterClose === 'function') {
            scope.dialog.afterClose();
          }
        };
        scope.dialog.confirm = function () {
          this.submiting = Constant.submiting;
          this.isError = false;
          scope.dialog.requestSender.method.call(
            null,
            scope.dialog.requestSender.params ? scope.dialog.requestSender.params() : null,
            function (resp) {
              scope.dialog.submiting = '';
              if (resp && resp.respCode && resp.respCode.indexOf('_2') === 0) {
                if (typeof scope.dialog.requestSender.success === 'function') {
                  scope.dialog.requestSender.success(resp);
                }
                scope.dialog.isOpen = false;
              } else {
                scope.dialog.isError = true;
                scope.dialog.isOpen = true;
                if (resp.errMsg) {
                  scope.dialog.errorMsg = resp.errMsg;
                }
                if (typeof scope.dialog.requestSender.error === 'function') {
                  scope.dialog.requestSender.error();
                }
              }
            },
            function () {
              scope.dialog.submiting = '';
              scope.dialog.isError = true;
              if (typeof scope.dialog.requestSender.error === 'function') {
                scope.dialog.requestSender.error();
              }
            });
        };
      }
    };
  }
  return {
    name: 'dialog',
    directiveFn: fn
  };
});
