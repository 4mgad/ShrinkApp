var TestSuite = {
  run: function(callback) {
    console.log('Testing ShrinkCSS.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");

    var ShrinkCSS = require("../lib/filters/ShrinkCSS.js");

    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        console.log(err);
      } else {
        var buildDir = appConf.getBuildDir();
        var shrinkCSS = new ShrinkCSS.getInstance(appConf);

        fs.deleteDir(buildDir, function(err, dir) {
          if (err) {
            console.log(err);
          }
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              console.log(err);
            } else {



              var testCase1 = function() {
                shrinkCSS.applyFilter(buildDir + '/css/styles_2.css', function(err, minCSSFiles) {
                  console.log('Test Case #1');
                  if (err) {
                    console.log(err);
                  } else {
                    if (fs.existsSync(minCSSFiles[0])) {
                      var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
                      var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-4-1.css', 'utf8');
                      if (cssTxt === validCssTxt) {
                        console.log('SUCCESS!');
                        testCase2();
                      } else {
                        console.log("generated file: " + minCSSFiles[0]);
                        console.log("cssTxt: " + cssTxt);
                        console.log("");
                        console.log("valid file: " + buildDir + '/css/test-case-4-1.css');
                        console.log("validCssTxt: " + validCssTxt);
                        console.log('FAILED');
                      }
                    } else {
                      console.log('FAILED');
                    }
                  }
                });
              }();

              var testCase2 = function() {
                shrinkCSS.applyFilter([
                  buildDir + '/css/styles.css',
                  buildDir + '/css/styles_2.css',
                  buildDir + '/css/styles_3.css'
                ], function(err, minCSSFiles) {
                  console.log('Test Case #2');
                  if (err) {
                    console.log(err);
                  } else {
                    if (fs.existsSync(minCSSFiles[0])) {
                      var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
                      var validCssTxt = fs.readFileSync(buildDir + '/css/test-case-4-2.css', 'utf8');
                      if (cssTxt === validCssTxt) {
                        console.log('SUCCESS!');
                        testCase3();
                      } else {
                        console.log("generated file: " + minCSSFiles[0]);
                        console.log("cssTxt: " + cssTxt);
                        console.log("");
                        console.log("valid file: " + buildDir + '/css/test-case-4-2.css');
                        console.log("validCssTxt: " + validCssTxt);
                        console.log('FAILED');
                      }
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
