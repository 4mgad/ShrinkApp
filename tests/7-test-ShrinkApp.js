var TestSuite = {
  run: function(callback) {
    console.log('Testing ShrinkApp.js');

    var fs = require("fs");
    var normalizeHTML = require("./TestUtils.js").normalizeHTML;
    var ShrinkApp = require("../ShrinkApp.js");

    var testCase1 = function() {
      console.log('Test Case #1');
      ShrinkApp.shrink(__dirname + '/app', true, function(err, arr, outputPath, appConf) {
        if (err) {
          console.log(err);
        } else {
          var appName = appConf.get('app-name');
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
            testCase2();
          }
        }
      });
    }();

    var testCase2 = function() {
      console.log('Test Case #2');
      ShrinkApp.shrink(__dirname + '/app', false, function(err, arr) {
        if (err) {
          console.log("SUCCESS!");
          callback();
        } else {
          console.log("FAILED");
        }
      });
    };

  }
};
module["exports"] = TestSuite;
