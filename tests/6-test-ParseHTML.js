var TestSuite = {
  run: function(callback) {
    console.log('Testing ParseHTML.js');

    var fs = require("extendfs");
    var Config = require("../lib/Config.js");
    var ParseHTML = require("../lib/filters/ParseHTML.js");

    var appConf = new Config();
    var outPath = appConf.get("output-path");
    appConf.config({
      "output-path": __dirname + '/' + outPath
    });
    var appName = appConf.get("app-name");

    var parseHTML = new ParseHTML.getInstance(appConf);

    fs.deleteDir(__dirname + '/build', function(err, dir) {
      if (err) {
        console.log(err);
      }
      fs.copyDir(__dirname + '/app', __dirname + '/build', function(err, src, dest) {
        if (err) {
          console.log(err);
        } else {



          var testCase1 = function() {
            console.log('Test Case #1');
            parseHTML.applyFilter(__dirname + '/build/index_3.html', function(err, htmlArr) {
              if (err) {
                console.log(err);
              } else {
                var HTMLTxt = fs.readFileSync(__dirname + '/build/index_3.html', 'utf8');
                var validHTMLTxt = fs.readFileSync(__dirname + '/build/test-case-6-1.html', 'utf8');
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
            parseHTML.applyFilter(__dirname + '/build/index_1.html', function(err, htmlArr) {
              if (err) {
                console.log(err);
              } else {
                var HTMLTxt = fs.readFileSync(__dirname + '/build/index_1.html', 'utf8');
                var validHTMLTxt = fs.readFileSync(__dirname + '/build/test-case-6-2.html', 'utf8');
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
              __dirname + '/build/index.html',
              __dirname + '/build/index_1.html',
              __dirname + '/build/index_2.html',
              __dirname + '/build/index_3.html'
            ], function(err, htmlArr) {
              if (err) {
                console.log(err);
              } else {
                var HTMLTxt1 = fs.readFileSync(__dirname + '/build/index.html', 'utf8');
                var validHTMLTxt1 = fs.readFileSync(__dirname + '/build/test-case-6-3-1.html', 'utf8');
                var HTMLTxt2 = fs.readFileSync(__dirname + '/build/index_1.html', 'utf8');
                var validHTMLTxt2 = fs.readFileSync(__dirname + '/build/test-case-6-3-2.html', 'utf8');
                var HTMLTxt3 = fs.readFileSync(__dirname + '/build/index_2.html', 'utf8');
                var validHTMLTxt3 = fs.readFileSync(__dirname + '/build/test-case-6-3-3.html', 'utf8');
                var HTMLTxt4 = fs.readFileSync(__dirname + '/build/index_3.html', 'utf8');
                var validHTMLTxt4 = fs.readFileSync(__dirname + '/build/test-case-6-3-4.html', 'utf8');

                //app name may be dynamically generated so excluding this
                HTMLTxt1 = HTMLTxt1.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                validHTMLTxt1 = validHTMLTxt1.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                HTMLTxt2 = HTMLTxt2.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                validHTMLTxt2 = validHTMLTxt2.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                HTMLTxt3 = HTMLTxt3.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                validHTMLTxt3 = validHTMLTxt3.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                HTMLTxt4 = HTMLTxt4.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
                validHTMLTxt4 = validHTMLTxt4.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');

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
};
module["exports"] = TestSuite;
