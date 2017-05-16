exports.buildCfg = {
    scpConfig: {
        host: '192.168.2.177',
        username: 'root',
        password: 'Welcome1',
        dest: '/opt/apps/workflow_tomcat/webapps/examples/techops',
        readyTimeout: 50000
    },
    appAPIURL: {
      'local': 'http://192.168.2.177:8886/techops',
      'production': 'https://localhost/techops'
    }
}
