var TestSuite = require("./TestSuite.js");

var fs = require("fs");
var normalizeHTML = require("./TestUtils.js").normalizeHTML;
var ShrinkApp = require("../ShrinkApp.js");

module["exports"] = new TestSuite("ShrinkApp.js", [
  function(callback) {
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
              fail = true;
            }
          }
        });
        if (fail) {
          callback('FAILED');
        } else {
          callback();
        }
      }
    });
  },
  function(callback) {
    ShrinkApp.shrink(__dirname + '/app', false, function(err, arr) {
      if (err) {
        callback();
      } else {
        callback('FAILED');
      }
    });
  }
]);
