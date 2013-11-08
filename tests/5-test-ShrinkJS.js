var TestSuite = {
  run: function(callback) {
    console.log('Testing ShrinkJS.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");
    var ShrinkJS = require("../lib/filters/ShrinkJS.js");

    var appConf = new Config();
    var shrinkJS = new ShrinkJS.getInstance(appConf);
    var outPath = appConf.get("output-path");
    appConf.config({
      "output-path": __dirname + '/' + outPath
    });

    fs.deleteDir(__dirname + '/build', function(err, dir) {
      if (err) {
        console.log(err);
      }
      fs.copyDir(__dirname + '/app', __dirname + '/build', function(err, src, dest) {
        if (err) {
          console.log(err);
        } else {



          var testCase1 = function() {
            shrinkJS.applyFilter(__dirname + '/build/js/app.js', function(err, minJSFiles) {
              console.log('Test Case #1');
              if (err) {
                console.log(err);
              } else {
                var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');
                var validJsTxt = fs.readFileSync(__dirname + '/build/js/test-case-5-1.js', 'utf8');

                if (jsTxt === validJsTxt) {
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
              __dirname + '/build/js/app.js',
              __dirname + '/build/js/controllers.js',
              __dirname + '/build/js/directives.js',
              __dirname + '/build/js/filters.js',
              __dirname + '/build/js/services.js'
            ], function(err, minJSFiles) {
              console.log('Test Case #2');
              if (err) {
                console.log(err);
              } else {
                var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');
                var validJsTxt = fs.readFileSync(__dirname + '/build/js/test-case-5-2.js', 'utf8');

                if (jsTxt === validJsTxt) {
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
                  callback();
                } else {
                  console.log('FAILED');
                }
              }
            });
          };



        }
      });
    });

  }
};
module["exports"] = TestSuite;
