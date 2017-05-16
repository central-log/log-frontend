// Karma configuration

module.exports = function(config) {
  require('./karma.common.conf')(config);

  config.set({
    // TODO: mocha not fully supported in angular-mocks. See https://github.com/angular/angular.js/issues/3022
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/sugar/release/sugar-full.development.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-promise-tracker/promise-tracker.js',
      'app/bower_components/angular-ui-utils/ui-utils.js',
      'app/bower_components/angular-translate/angular-translate.js',
      'app/bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
      'app/bower_components/messageformat/messageformat.js',
      'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-currency-filter/src/currency-filter.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ellipsis/src/angular-ellipsis.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/chai/chai.js',
      'app/bower_components/bowser/bowser.js',
      'app/bower_components/modernizr/modernizr.js',
      'app/bower_components/mousetrap/mousetrap.js',
      'app/scripts/dforms/iterator/iterator.module.js',
      'app/scripts/dforms/summary/summary.module.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'app/views/**/*.html',
      'test/mock/**/*.js',
      'test/helper/**/*.js',
      'test/spec/**/*.js'
    ],

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'app/',
      // register templates with existing app
      moduleName: 'mppApp'
    },

    plugins: [
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-ng-html2js-preprocessor'
    ],

    // web server port
    port: 9876,

    runnerPort: 9100,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS']
  });
};
