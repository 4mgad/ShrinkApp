var TestSuite = {
  run: function(callback) {
    console.log('Testing ShrinkJS.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");
    var ShrinkJS = require("../lib/filters/ShrinkJS.js");

    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        console.log(err);
      } else {
        var buildDir = appConf.getBuildDir();
        var shrinkJS = new ShrinkJS.getInstance(appConf);

        fs.deleteDir(buildDir, function(err, dir) {
          if (err) {
            console.log(err);
          }
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              console.log(err);
            } else {



              var testCase1 = function() {
                var validJsTxt = fs.readFileSync(buildDir + '/js/test-case-5-1.js', 'utf8');
                shrinkJS.applyFilter(buildDir + '/js/app.js', function(err, minJSFiles) {
                  console.log('Test Case #1');
                  if (err) {
                    console.log(err);
                  } else {
                    var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');

                    if (jsTxt === validJsTxt) {
                      console.log('SUCCESS!');
                    } else {
                      console.log(minJSFiles[0]);
                      console.log('FAILED');
                    }
                  }
                });
              }();

              var testCase2 = function() {
                var validJsTxt = fs.readFileSync(buildDir + '/js/test-case-5-2.js', 'utf8');
                shrinkJS.applyFilter([
                  buildDir + '/js/app.js',
                  buildDir + '/js/controllers.js',
                  buildDir + '/js/directives.js',
                  buildDir + '/js/filters.js',
                  buildDir + '/js/services.js'
                ], function(err, minJSFiles) {
                  console.log('Test Case #2');
                  if (err) {
                    console.log(err);
                  } else {
                    var jsTxt = fs.readFileSync(minJSFiles[0], 'utf8');

                    if (jsTxt === validJsTxt) {
                      console.log('SUCCESS!');
                    } else {
                      console.log(minJSFiles[0]);
                      console.log('FAILED');
                    }
                  }
                });
              }();


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
              }();



            }
          });
        });

      }
    });

  }
};
module["exports"] = TestSuite;
