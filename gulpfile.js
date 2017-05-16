var gulp = require('gulp-param')(require('gulp'), process.argv),
  gutil = require('gulp-util'),
  gulpIgnore = require('gulp-ignore'),
  fs = require('fs'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  mkdirp = require('mkdirp'),
  jsonlint = require("gulp-jsonlint"),
  //jsdoc = require("gulp-jsdoc"),
  rjs = require('gulp-requirejs'),
  buildFile = './build.js',
  buildCfg = require(buildFile).buildCfg,
  htmlConfig = require('./app/views/config').config,
  minifyCss = require('gulp-minify-css'),
  pkg = require('./package.json'),
  replace = require('gulp-replace'),
  fail   = require('gulp-fail');
var gulpif = require('gulp-if');
    useref = require('gulp-useref'),
    RevAll = require('gulp-rev-all'),
    concatUtil = require('gulp-concat-util');
    git = require('git-rev-sync');
var scriptsBase = 'app/scripts',
  angularModuleName ='DRApp',
  thirdLibs = 'scripts/lib/**/*.*';
  htmlTemplate = 'app/views/template.html',
  appDir = 'app/',
  generatedFoler='dist',
  reportersFolder = 'reporters',
  jshintReport = 'jshint.html',
  docSite='doc',
  jsDocName='Permission Portal',
  jsDocDesc='JS Documentation for Portal XXX',
  totalBuildJS = 'build.rs.js';


// gulp --env dev
// gulp --env demo
// gulp --env stage
// gulp --env production
// JS Hint
// Ignored files refer to file .jshintignore
gulp.task('updateAPI', ['uglifyJs'], function(env){
  console.log('env='+env);
  var selectedEnv = env;
  if(!env){
    selectedEnv = 'local';
  }
  gulp.src(scriptsBase + '/utils/Constant.js')
    .pipe(replace(/https?:\/\/.*\:?\d+/g, buildCfg.appAPIURL[selectedEnv]))
    .pipe(uglify())
    .pipe(gulp.dest(generatedFoler+'/scripts/utils/'));
});

gulp.task('scpServer', ['scpAll'], function(folder) {

  var scp = require('gulp-scp2');

  console.log('Upload Files to Remote Server '+ buildCfg.scpConfig.host + ' folder '+ buildCfg.scpConfig.dest);
  var scpFolder = generatedFoler+(folder? folder: '')+'/**/*';
  console.log('folder='+scpFolder);
  buildCfg.scpConfig.dest += (folder? folder: '');
  console.log('scp dest: '+buildCfg.scpConfig.dest);
  return gulp.src(scpFolder)
  .pipe(scp(buildCfg.scpConfig))
  .on('error', function(err) {
    console.log('Upload Failed with Error: ', err);
  });
});

// JS Hint
// Ignored files refer to file .jshintignore
gulp.task('jshint', function() {
  var jshint = require('gulp-jshint');
  return gulp.src(scriptsBase + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: __dirname + '/'+reportersFolder+'/'+jshintReport,
      createMissingFolders : true
    }));
});

// Format js, css, json, html
// Ignore 3rd party
gulp.task('beautifier', function() {
  var prettify = require('gulp-jsbeautifier');
  gulp.src(appDir+'**/*.{js,json,css,html}', {base: appDir})
    .pipe(gulpIgnore.exclude(thirdLibs))
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest(appDir));
});

// Generate JS Documentation

// Check JSON file is valid
gulp.task('jsonlint',  function() {
  gulp.src(appDir+'**/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.failAfterError())
    .pipe(jsonlint.reporter());
});

// RequireJS to Compile Libs
gulp.task('rjs', ['html2js', 'updateAPI', 'others', 'lib'], function() {
  var revAll = new RevAll({
        dontRenameFile: ['.html'] ,  //不重命名文件
        dontUpdateReference: ['.html'],
        dontGlobal: [ /^\/favicon.ico$/ ]  //无需关联处理文件
        //,prefix: appPath   //该项配置只影响绝对路径的资源
    });

  rjs({
    baseUrl: generatedFoler+'/scripts',
    mainConfigFile: generatedFoler+'/scripts/config.js',
    removeCombined: true,
    name: 'modules/loan',
    exclude: ['angular', 'ngResource', 'ngLocalStorage', 'ngCookies', 'ngRoute', 'angular.ui.bootstrap'],
    out: 'scripts/modules/loan.js'
  })
  .pipe(gulp.dest(generatedFoler));
});

// generate multiple html page via app/views/config.js and app/layout.html
// login: {
//    folder --> generated html under which folder
//    title  --> web page title
//    styles --> CSS files insert into generated html
//    scripts--> JS  files insert into generated html
//  }
gulp.task('ghtml', ['uglifyJs'], function() {
  var page, content, styles, scripts, idx, len;
  var stylesTemplate='<link rel="stylesheet" href="{{css}}">\n',
    scriptsTemplte='<script type="text/javascript" src="{{js}}"></script>\n';
    htmlTemplate = fs.readFileSync(htmlTemplate, 'utf8');

  for(var name in htmlConfig){
    if(htmlConfig.hasOwnProperty(name)){
      page = htmlConfig[name];
      //Insert page specfic styles in generated html
      styles = '';
      if(page.styles){
        for(idx=0, len = page.styles.length;idx<len;idx++){
          styles+=stylesTemplate.replace('{{css}}', page.styles[idx]);
        }
      }else{
        // add attribute so that replace the holder in the template holder
        page.styles='';
      }
      //Insert page specfic scripts in generated html
      scripts='';
      if(page.scripts){
        for(idx=0, len = page.scripts.length;idx<len;idx++){
          scripts+=scriptsTemplte.replace('{{js}}', page.scripts[idx]);
        }
      }else{
        // add attribute so that replace the holder in the template holder
        page.scripts='';
      }
      content = htmlTemplate;
      for(var holder in page){
        switch(holder){
          case 'folder': break;
          case 'styles': content = content.replace('{--'+holder+'--}', styles); break;
          case 'scripts': content = content.replace('{--'+holder+'--}', scripts); break;
          default:  content = content.replace('{--'+holder+'--}', page[holder]); break;
        }
      }

      var dest = appDir+(page.folder?page.folder:'');
      if (!fs.existsSync(dest)){
        mkdirp.sync(dest);
      }
      if(dest.charAt(dest.length-1)!=='/'){
        dest+='/';
      }
      dest= dest + name+'.html';
      fs.writeFileSync(dest, content, 'utf8');
    }
  }
});

var templateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var opts = {
    conditionals: true,
    spare:true,
    empty: true,
    quotes: true
  };
var templateHeader =  'define(["drApp"], function (app) { app.run(["$templateCache", function ($templateCache) {';
var templateFooter =  '  }]); return app; });'
//gulp.task('html2js', ['minify-html'], function () {
gulp.task('html2js', ['ghtml', 'uglifyJs'], function () {
    return gulp.src(appDir+'views/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(templateCache('templates.js', {
      module: angularModuleName,
      templateHeader: templateHeader,
      templateFooter: templateFooter,
      root: 'views/'
    }))
    .pipe(gulp.dest(generatedFoler+'/scripts/modules/'));
});

// copy all file in the root folder
gulp.task('uglifyJs',  function(cb){
  return gulp.src(appDir+'scripts/**/*.*', {base: appDir})
    .pipe(gulpIgnore.exclude('scripts/lib/**/*.*'))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest(generatedFoler));
});

// copy all file in the root folder
gulp.task('others', ['ghtml'], function(cb){
  return gulp.src(appDir+'**/*.*', {base: appDir})
    .pipe(gulpIgnore.exclude('scripts/**/*.*'))
    //.pipe(gulpIgnore.exclude('styles/**/*.*'))
    .pipe(gulpIgnore.exclude('views/**/*.*'))
    .pipe(gulpif('*.json', minifyHTML()))
    .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
    .pipe(gulp.dest(generatedFoler));
});

// copy 3rh libs
gulp.task('lib', function(cb){
  return gulp.src(appDir+'scripts/lib/**/*.*', {base: appDir})
    .pipe(gulp.dest(generatedFoler));
});

var commitID = '', branch = '';
gulp.task('git', function(){
  commitID = git.short();
  branch = git.branch();
});

gulp.task('replaceRef', ['git', 'ghtml', 'others', 'updateAPI', 'rjs'],  function () {
    var assets = useref.assets({ searchPath: generatedFoler });
    var revAll = new RevAll({
        dontRenameFile: ['.html'] ,  //不重命名文件
        dontUpdateReference: ['.html'],
        dontGlobal: [ /^\/favicon.ico$/ ]  //无需关联处理文件
        //,prefix: appPath   //该项配置只影响绝对路径的资源
    });
    var generatedTime = new Date();
    var buildTime = '\/\* '+generatedTime.toLocaleDateString() +' '+ generatedTime.toLocaleTimeString() + '\n' + 'commitID:' + commitID + '\n' + 'branch:' + branch +'\*\/';
    return gulp.src(generatedFoler+'/*.html')
        //.pipe(gulpIgnore.exclude('views/**/*.*'))
        .pipe(assets)
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revAll.revision())
        .pipe(gulpif('*.js', concatUtil.header(buildTime+'\n\'use strict\';\n')))
        .pipe(gulp.dest(generatedFoler));
})
// Remove generated Folder & files
gulp.task('clean', function(cb){
  del([generatedFoler, totalBuildJS], {force: true}, cb);
});

//Todo: Home page conver test report page & jshint report page & JSON report page
// Local Dev Env
// gulp.task('dev', ['ghtml', 'jsonlint', 'jshint', 'beautifier'], function() {
gulp.task('dev', ['ghtml', 'jsonlint', 'jshint'], function() {
    var browserSync = require('browser-sync').create();
//gulp.task('dev', ['ghtml', 'jsonlint', 'jshint'], function() {
    // Using the source code
    browserSync.init({
        server: {
            baseDir: ['.', reportersFolder],
            index: jshintReport,
            directory: true
        },
        port: 8080
    });

    gulp.watch("app/**/*.{html,css,json,jpg,png}").on('change', browserSync.reload);
});
gulp.task('validateEnv', function(env) {

  if(['production', 'stage', 'demo', 'dev', 'local'].indexOf(env && env.trim()) == -1) {
    throw new Error('Environment Not Specified, Support production | stage | demo | dev \n Usage: gulp --env production');
  }
});
// Package all the resources to deploy
gulp.task('default', ['validateEnv', 'jsonlint', 'lib', 'html2js', 'others', 'rjs', 'replaceRef'], function() {

});
// Package all the resources to deploy
gulp.task('scpAll', ['jsonlint', 'lib', 'html2js', 'others', 'rjs', 'replaceRef'], function() {

});

gulp.task('scp', ['scpServer'], function() {
  console.log('Done.');
});
