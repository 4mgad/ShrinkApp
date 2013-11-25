var TestSuite = require("./TestSuite.js");

var fs = require("extendfs");
var Config = require("../lib/Config.js");
var ShrinkJS = require("../lib/filters/ShrinkJS.js");

var g = {};

var shrinkJSTS = new TestSuite("ShrinkJS.js", [
  //0
  function(callback) {
    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = g.buildDir = appConf.getBuildDir();
        g.shrinkJS = new ShrinkJS.getInstance(appConf);
        fs.deleteDir(buildDir, function(err, dir) {
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              callback(err);
            } else {
              callback();
            }
          });
        });
      }
    });
  },
  //1
  function(callback) {
    var buildDir = g.buildDir;
    var shrinkJS = g.shrinkJS;
    var validJsTxt = fs.readFileSync(buildDir + '/js/test-case-5-1.js', 'utf8');
    shrinkJS.applyFilter(buildDir + '/js/app.js', function(err, minJSFiles) {
      if (err) {
        callback(err);
      } else {
        var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');

        if (jsTxt === validJsTxt) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //2
  function(callback) {
    var buildDir = g.buildDir;
    var shrinkJS = g.shrinkJS;
    var validJsTxt = fs.readFileSync(buildDir + '/js/test-case-5-2.js', 'utf8');
    shrinkJS.applyFilter([
      buildDir + '/js/app.js',
      buildDir + '/js/controllers.js',
      buildDir + '/js/directives.js',
      buildDir + '/js/filters.js',
      buildDir + '/js/services.js'
    ], function(err, minJSFiles) {
      if (err) {
        callback(err);
      } else {
        var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');

        if (jsTxt === validJsTxt) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //3
  function(callback) {
    var shrinkJS = g.shrinkJS;
    shrinkJS.finalize(function(err, arr) {
      if (err) {
        callback(err);
      } else {
        var noneExist = true;
        for (var i = 0; i < arr.length; i++) {
          var file = arr[i];
          if (fs.existsSync(file)) {
            noneExist = false;
          }
        }
        if (arr.length && noneExist) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  }

]);

module["exports"] = shrinkJSTS;
