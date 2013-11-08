console.log('Testing ShrinkApp.js');

var fs = require("fs");
var path = require("path");
var Config = require("../lib/Config.js");
var ShrinkApp = require("../ShrinkApp.js");

var appConf = new Config(__dirname + '/app/app.json');
var appName = appConf.get("app-name");

var testCase1 = function() {
  ShrinkApp.shrink(__dirname + '/app', function(err, arr) {
    if (err) {
      console.log(err);
    } else {
      var fail = false;
      arr.forEach(function(file) {
        if (file.indexOf('test-case-7') === -1) {
          var buildPath = __dirname + '/build';
          var validFile = buildPath + '/test-case-7' + file.substring(buildPath.length);
          var htmlTxt = fs.readFileSync(file, 'utf8');
          var validHtmlTxt = fs.readFileSync(validFile, 'utf8');
          var htmlTxt = htmlTxt.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
          var validHtmlTxt = validHtmlTxt.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
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
      }
    }
  });
}();
