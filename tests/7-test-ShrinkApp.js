var TestSuite = {
  run: function(callback) {
    console.log('Testing ShrinkApp.js');

    var fs = require("fs");
    var path = require("path");
    var Config = require("../lib/Config.js");
    var normalizeHTML = require("./TestUtils.js").normalizeHTML;
    var ShrinkApp = require("../ShrinkApp.js");

    var appConf = new Config();
    appConf.config(__dirname + '/app/app.json', function(err) {
      if (err) {
        console.log(err);
      } else {
        var appName = appConf.get("app-name");
        var outputPath = appConf.getOutputPath();

        var testCase1 = function() {
          ShrinkApp.shrink(__dirname + '/app', function(err, arr) {
            if (err) {
              console.log(err);
            } else {
              var fail = false;
              arr.forEach(function(file) {
                if (file.indexOf('test-case-7') === -1) {
                  var validFile = outputPath + '/test-case-7' + file.substring(outputPath.length);
                  var htmlTxt = normalizeHTML(fs.readFileSync(file, 'utf8'), appName);
                  var validHtmlTxt = normalizeHTML(fs.readFileSync(validFile, 'utf8'), appName);
                  if (htmlTxt !== validHtmlTxt) {
                    console.log(file);
                    fail = true;
                  }
                }
              });
              if (fail) {
                console.log("FAILED");
              } else {
                console.log("SUCCESS!");
                callback();
              }
            }
          });
        }();
      }
    });

  }
};
module["exports"] = TestSuite;
