var TestSuite = require("./TestSuite.js");

var fs = require("extendfs");
var Config = require("../lib/Config.js");
var CompileLESS = require("../lib/filters/CompileLESS.js");

var g = {};

module["exports"] = new TestSuite("CompileLESS.js", [
  //0
  function(callback) {
    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = g.buildDir = appConf.getBuildDir();
        g.compileLESS = new CompileLESS.getInstance(appConf);
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
    var compileLESS = g.compileLESS;
    compileLESS.applyFilter(buildDir + '/css/styles.less', function(err, cssArr) {
      if (err) {
        callback(err);
      } else {
        var allExist = true;
        for (var i = 0; i < cssArr.length; i++) {
          var file = cssArr[i];
          if (!fs.existsSync(file)) {
            allExist = false;
          }
        }
        var cssTxt = fs.readFileSync(cssArr[0], 'utf8');
        var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-3-1.css', 'utf8');
        if (cssArr.length && allExist && cssTxt === validCssTxt) {
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
    var compileLESS = g.compileLESS;
    compileLESS.applyFilter([
      buildDir + '/css/styles_1.less',
      buildDir + '/css/styles_2.less'
    ], function(err, cssArr) {
      if (err) {
        callback(err);
      } else {
        var allExist = true;
        for (var i = 0; i < cssArr.length; i++) {
          var file = cssArr[i];
          if (!fs.existsSync(file)) {
            allExist = false;
          }
        }
        if (cssArr.length && cssArr.length === 2 && allExist) {
          var cssTxt1 = fs.readFileSync(cssArr[0], 'utf8');
          var validCssTxt1 = fs.readFileSync(buildDir + '/css/test-case-3-2.css', 'utf8');
          var cssTxt2 = fs.readFileSync(cssArr[1], 'utf8');
          var validCssTxt2 = fs.readFileSync(buildDir + '/css/test-case-3-3.css', 'utf8');
          if (cssTxt1 === validCssTxt1 && cssTxt2 === validCssTxt2) {
            callback();
            return;
          }
        }
        callback('FAILED');
      }
    });
  },
  //3
  function(callback) {
    var compileLESS = g.compileLESS;
    compileLESS.finalize(function(err, arr) {
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
