var TestSuite = require("./TestSuite.js");

var fs = require("extendfs");
var Config = require("../lib/Config.js");
var ShrinkJS = require("../lib/filters/ShrinkJS.js");

var appConf = new Config();

module["exports"] = new TestSuite("ShrinkJS.js", [
  //0
  function(callback) {
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = appConf.getBuildDir();
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
    var buildDir = appConf.getBuildDir();
    var shrinkJS = ShrinkJS.getInstance(appConf);
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
    var buildDir = appConf.getBuildDir();
    var shrinkJS = ShrinkJS.getInstance(appConf);
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
    var shrinkJS = ShrinkJS.getInstance(appConf);
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
