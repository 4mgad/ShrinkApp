var TestSuite = {
  run: function(callback) {
    console.log('Testing CompileLESS.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");
    var CompileLESS = require("../lib/filters/CompileLESS.js");

    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        console.log(err);
      } else {
        var buildDir = appConf.getBuildDir();
        var compileLESS = new CompileLESS.getInstance(appConf);

        fs.deleteDir(buildDir, function(err, dir) {
          if (err) {
            console.log(err);
          }
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              console.log(err);
            } else {

              var testCase1 = function() {
                compileLESS.applyFilter(buildDir + '/css/styles.less', function(err, cssArr) {
                  console.log('Test Case #1');
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
                    var cssTxt = fs.readFileSync(cssArr[0], 'utf8');
                    var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-3-1.css', 'utf8');
                    if (cssArr.length && allExist && cssTxt === validCssTxt) {
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
                  buildDir + '/css/styles_1.less',
                  buildDir + '/css/styles_2.less'
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
                      var cssTxt1 = fs.readFileSync(cssArr[0], 'utf8');
                      var validCssTxt1 = fs.readFileSync(buildDir + '/css/test-case-3-2.css', 'utf8');
                      var cssTxt2 = fs.readFileSync(cssArr[1], 'utf8');
                      var validCssTxt2 = fs.readFileSync(buildDir + '/css/test-case-3-3.css', 'utf8');
                      if (cssTxt1 === validCssTxt1 && cssTxt2 === validCssTxt2) {
                        console.log('SUCCESS!');
                        testCase3();
                        return;
                      }
                    }
                    console.log('FAILED');
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

    });

  }
};
module["exports"] = TestSuite;
