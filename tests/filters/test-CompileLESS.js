console.log('Testing CompileLESS.js');

var fs = require("extendfs");
var ShrinkApp = require("../../ShrinkApp.js");
var CompileLESS = require("../../lib/filters/CompileLESS.js");

var appConf = new ShrinkApp().appConf;

var compileLESS = new CompileLESS.getInstance(appConf);

fs.deleteDir('build', function(err, dir) {
  if (err) {
    console.log(err);
  }
  fs.copyDir('app', 'build', function(err, src, dest) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        compileLESS.applyFilter('build/css/styles.less', function(err, arr) {
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
          'build/css/styles_1.less',
          'build/css/styles_2.less'
        ], function(err, cssArr) {
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
            if (cssArr.length && cssArr.length === 2 && allExist) {
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

