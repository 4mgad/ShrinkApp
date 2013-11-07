console.log('Testing ShrinkJS.js');

var fs = require("extendfs");
var Config = require("../../lib/Config.js");
var ShrinkJS = require("../../lib/filters/ShrinkJS.js");

var appConf = new Config();
var shrinkJS = new ShrinkJS.getInstance(appConf);
var outPath = appConf.get("output-path");

fs.deleteDir('build', function(err, dir) {
  if (err) {
    console.log(err);
  }
  fs.copyDir('app', 'build', function(err, src, dest) {
    if (err) {
      console.log(err);
    } else {



      var testCase1 = function() {
        shrinkJS.applyFilter('build/js/app.js', function(err, minJSFiles) {
          console.log('Test Case #1');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minJSFiles[0])) {
              console.log('SUCCESS!');
              testCase2();
            } else {
              console.log('FAILED');
            }
          }
        });
      }();

      var testCase2 = function() {
        if (!fs.existsSync(outPath)) {
          fs.mkdirSync(outPath);
        }
        shrinkJS.applyFilter([
          'build/js/app.js',
          'build/js/controllers.js',
          'build/js/directives.js',
          'build/js/filters.js',
          'build/js/services.js'
        ], function(err, minJSFiles) {
          console.log('Test Case #2');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minJSFiles[0])) {
              console.log('SUCCESS!');
              testCase3();
            } else {
              console.log('FAILED');
            }
          }
        });
      };


      var testCase3 = function() {
        shrinkJS.finalize(function(err, arr) {
          console.log('Test Case #3');
          if (err) {
            console.log(err);
          } else {
            var noneExist = true;
            for (var i = 0; i < arr.length; i++) {
              var file = arr[i];
              if (fs.existsSync(file)) {
                noneExist = false;
              }
            }
            if (arr.length && noneExist) {
              console.log('SUCCESS!');
            } else {
              console.log('FAILED');
            }
          }
        });
      };



    }
  });
});

