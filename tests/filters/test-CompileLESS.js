console.log('Testing CompileLESS.js');

var fs = require("fs");
var ShrinkApp = require("../../ShrinkApp.js");
var Utils = require("../../lib/Utils.js");
var CompileLESS = require("../../lib/filters/CompileLESS.js");

var appConf = new ShrinkApp().appConf;

var compileLESS = new CompileLESS.getInstance(appConf);

Utils.deleteDir('_less', null, function(err) {
  if (err) {
    console.log(err);
  }
  Utils.copyDir('less', '_less', null, function(err) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        compileLESS.applyFilter('_less/styles.less', function(err, arr) {
          console.log('Test Case #1');
          if (err) {
            console.log(err);
          } else {
            var allExist = true;
            for (var i = 0; i < arr.length; i++) {
              var file = arr[i];
              if (!fs.existsSync(file)) {
                allExist = false;
              }
            }
            if (arr.length && allExist) {
              console.log('SUCCESS!');
              testCase2();
            } else {
              console.log('FAILED');
            }
          }
        });
      }();


      var testCase2 = function() {
        compileLESS.applyFilter([
          '_less/styles_1.less',
          '_less/styles_2.less'
        ], function(err, cssArr, lessArr) {
          console.log('Test Case #2');
          if (err) {
            console.log(err);
          } else {
            var allExist = true;
            for (var i = 0; i < cssArr.length; i++) {
              var file = cssArr[i];
              if (!fs.existsSync(file)) {
                allExist = false;
              }
            }
            if (cssArr.length && cssArr.length == lessArr.length && allExist) {
              console.log('SUCCESS!');
              testCase3();
            } else {
              console.log('FAILED');
            }
          }
        });
      };


      var testCase3 = function() {
        compileLESS.finalize(function(err, arr) {
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

