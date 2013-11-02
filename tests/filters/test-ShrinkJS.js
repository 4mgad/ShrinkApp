var fs = require("fs");
var ShrinkApp = require("../../ShrinkApp.js");
var Utils = require("../../lib/Utils.js");
var ShrinkJS = require("../../lib/filters/ShrinkJS.js");

console.log('Testing ShrinkJS.js');

var appConf = new ShrinkApp().appConf;
var outPath = appConf["output-path"];

var shrinkJS = new ShrinkJS.getInstance(appConf);

Utils.deleteDir('_js', null, function(err) {
  if (err) {
    console.log(err);
  }
  Utils.copyDir('js', '_js', null, function(err) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        if (!fs.existsSync(outPath)) {
          fs.mkdirSync(outPath);
        }
        shrinkJS.applyFilter('_js/app.js', function(err, minCssFile, minCssRelPath) {
          console.log('Test Case #1');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCssFile) && minCssRelPath === "js/app_0.min.js") {
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
          '_js/app.js',
          '_js/controllers.js',
          '_js/directives.js',
          '_js/filters.js',
          '_js/services.js'
        ], function(err, minCssFile, minCssRelPath) {
          console.log('Test Case #2');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCssFile) && minCssRelPath === "js/app_1.min.js") {
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

