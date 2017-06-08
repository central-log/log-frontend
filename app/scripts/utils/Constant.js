
/**
 * Module representing a shirt.
 * @module controllers/login
 */
define(function () {
  return {
    apiBase: "http://localhost:8081",
    // 40 seconds Time out
    reqTimeout: 40000,
    logLevels: ['Debug', 'Info', 'Log', 'Warning', 'Error'],
    pageSize: 50,
    hackMaxPageSize: 5e7,
    transformResponse: function (resp) {
      if (resp && resp.respCode && resp.respCode.indexOf('_2') === 0) {
        return resp.result;
      }
      return undefined;
    },
    loading: '正在加载...',
    submiting: '提交中...',
    createError: '创建失败',
    loadEmpty: '暂无数据',
    loadError: '加载失败',
    roleTypesArr: [{
      name: '请选择',
      value: null
    }, {
      name: '经理',
      value: 'MANAGER'
    }, {
      name: '组长',
      value: 'LEADER'
    }, {
      name: '组员',
      value: 'MEMBER'
    }, {
      name: '助理',
      value: 'ASSISTANT'
    }, {
      name: '总经理',
      value: 'SUPER_MANAGER'
    }, {
      name: '总监',
      value: 'DIRECTOR'
    }, {
      name: '培训',
      value: 'TRAINER'
    }],

    roleTypesObj: {
      'MANAGER': '经理',
      'LEADER': '组长',
      'MEMBER': '组员',
      'ASSISTANT': '助理',
      'SUPER_MANAGER': '总经理',
      'DIRECTOR': '总监',
      'TRAINER': '培训'
    },
    disableDropdownList: [{
      name: '请选择',
      value: null
    }, {
      name: '是',
      value: 0
    }, {
      name: '否',
      value: 1
    }]
  };

});
