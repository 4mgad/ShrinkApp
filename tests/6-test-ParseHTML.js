var TestSuite = {
  run: function(callback) {
    console.log('Testing ParseHTML.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");
    var normalizeHTML = require("./TestUtils.js").normalizeHTML;
    var ParseHTML = require("../lib/filters/ParseHTML.js");

    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        console.log(err);
      } else {
        var buildDir = appConf.getBuildDir();
        var appName = appConf.get("app-name");
        var parseHTML = new ParseHTML.getInstance(appConf);

        fs.deleteDir(buildDir, function(err, dir) {
          if (err) {
            console.log(err);
          }
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              console.log(err);
            } else {



              var testCase1 = function() {
                console.log('Test Case #1');
                parseHTML.applyFilter(buildDir + '/index_3.html', function(err, htmlArr) {
                  if (err) {
                    console.log(err);
                  } else {
                    var HTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/index_3.html', 'utf8'), appName);
                    var validHTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-1.html', 'utf8'), appName);
                    if (htmlArr.length === 1 && HTMLTxt === validHTMLTxt) {
                      console.log('SUCCESS!');
                      testCase2();
                    } else {
                      console.log('FAILED');
                    }
                  }
                });
              }();

              var testCase2 = function() {
                console.log('Test Case #2');
                parseHTML.applyFilter(buildDir + '/index_1.html', function(err, htmlArr) {
                  if (err) {
                    console.log(err);
                  } else {
                    var HTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/index_1.html', 'utf8'), appName);
                    var validHTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-2.html', 'utf8'), appName);
                    if (htmlArr.length === 1 && HTMLTxt === validHTMLTxt) {
                      console.log('SUCCESS!');
                      testCase3();
                    } else {
                      console.log('FAILED');
                    }
                  }
                });
              };

              var testCase3 = function() {
                console.log('Test Case #3');
                parseHTML.applyFilter([
                  buildDir + '/index.html',
                  buildDir + '/index_1.html',
                  buildDir + '/index_2.html',
                  buildDir + '/index_3.html'
                ], function(err, htmlArr) {
                  if (err) {
                    console.log(err);
                  } else {
                    var HTMLTxt1 = normalizeHTML(fs.readFileSync(buildDir + '/index.html', 'utf8'), appName);
                    var validHTMLTxt1 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-1.html', 'utf8'), appName);
                    var HTMLTxt2 = normalizeHTML(fs.readFileSync(buildDir + '/index_1.html', 'utf8'), appName);
                    var validHTMLTxt2 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-2.html', 'utf8'), appName);
                    var HTMLTxt3 = normalizeHTML(fs.readFileSync(buildDir + '/index_2.html', 'utf8'), appName);
                    var validHTMLTxt3 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-3.html', 'utf8'), appName);
                    var HTMLTxt4 = normalizeHTML(fs.readFileSync(buildDir + '/index_3.html', 'utf8'), appName);
                    var validHTMLTxt4 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-4.html', 'utf8'), appName);

                    if (HTMLTxt1 === validHTMLTxt1) {
                      if (HTMLTxt2 === validHTMLTxt2) {
                        if (HTMLTxt3 === validHTMLTxt3) {
                          if (HTMLTxt4 === validHTMLTxt4) {
                            if (htmlArr.length === 4) {
                              console.log('SUCCESS!');
                              callback();
                              return;
                            }
                          } else {
                            console.log("4 does not match");
                          }
                        } else {
                          console.log("3 does not match");
                        }
                      } else {
                        console.log("2 does not match");
                      }
                    } else {
                      console.log("1 does not match");
                    }
                    console.log('FAILED');
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
