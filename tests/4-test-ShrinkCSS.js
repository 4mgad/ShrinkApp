var TestSuite = require("./TestSuite.js");

var fs = require("extendfs");
var Config = require("../lib/Config.js");
var ShrinkCSS = require("../lib/filters/ShrinkCSS.js");

var g = {};

module["exports"] = new TestSuite("ShrinkCSS.js", [
  //0
  function(callback) {
    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = g.buildDir = appConf.getBuildDir();
        g.shrinkCSS = new ShrinkCSS.getInstance(appConf);
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
    var shrinkCSS = g.shrinkCSS;

    shrinkCSS.applyFilter(buildDir + '/css/styles_2.css', function(err, minCSSFiles) {
      if (err) {
        callback(err);
      } else {
        if (fs.existsSync(minCSSFiles[0])) {
          var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
          var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-4-1.css', 'utf8');
          if (cssTxt === validCssTxt) {
            callback();
          } else {
            console.log("generated file: " + minCSSFiles[0]);
            console.log("cssTxt: " + cssTxt);
            console.log("");
            console.log("valid file: " + buildDir + '/css/test-case-4-1.css');
            console.log("validCssTxt: " + validCssTxt);
            callback('FAILED');
          }
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //2
  function(callback) {
    var buildDir = g.buildDir;
    var shrinkCSS = g.shrinkCSS;
    shrinkCSS.applyFilter([
      buildDir + '/css/styles.css',
      buildDir + '/css/styles_2.css',
      buildDir + '/css/styles_3.css'
    ], function(err, minCSSFiles) {
      if (err) {
        callback(err);
      } else {
        if (fs.existsSync(minCSSFiles[0])) {
          var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
          var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-4-2.css', 'utf8');
          if (cssTxt === validCssTxt) {
            callback();
          } else {
            console.log("generated file: " + minCSSFiles[0]);
            console.log("cssTxt: " + cssTxt);
            console.log("");
            console.log("valid file: " + buildDir + '/css/test-case-4-2.css');
            console.log("validCssTxt: " + validCssTxt);
            callback('FAILED');
          }
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //3
  function(callback) {
    var shrinkCSS = g.shrinkCSS;
    shrinkCSS.finalize(function(err, arr) {
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
