var fs = require("fs");
var ShrinkApp = require("../../ShrinkApp.js");
var Utils = require("../../lib/Utils.js");
var ShrinkCSS = require("../../lib/filters/ShrinkCSS.js");

console.log('Testing ShrinkCSS.js');

var appConf = new ShrinkApp().appConf;
var outPath = appConf["output-path"];

var shrinkCSS = new ShrinkCSS.getInstance(appConf);

Utils.deleteDir('_css', null, function(err) {
  if (err) {
    console.log(err);
  }
  Utils.copyDir('css', '_css', null, function(err) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        if (!fs.existsSync(outPath)) {
          fs.mkdirSync(outPath);
        }
        shrinkCSS.applyFilter('_css/styles.css', function(err, minCssFile, minCssRelPath) {
          console.log('Test Case #1');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCssFile) && minCssRelPath === "css/app_0.min.css") {
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
        shrinkCSS.applyFilter([
          '_css/styles.css',
          '_css/styles_2.css',
          '_css/styles_3.css'
        ], function(err, minCssFile, minCssRelPath) {
          console.log('Test Case #2');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCssFile) && minCssRelPath === "css/app_1.min.css") {
              console.log('SUCCESS!');
              testCase3();
            } else {
              console.log('FAILED');
            }
          }
        });
      };


      var testCase3 = function() {
        shrinkCSS.finalize(function(err, arr) {
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

