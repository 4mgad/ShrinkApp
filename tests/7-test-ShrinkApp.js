console.log('Testing ShrinkApp.js');

var fs = require("fs");
var path = require("path");
var ShrinkApp = require("../ShrinkApp.js");

var testCase1 = function() {
  ShrinkApp.shrink(__dirname + '/app', function(err, arr) {
    if (err) {
      console.log(err);
    } else {
      var fail = false;
      arr.forEach(function(file) {
        if (file.indexOf('test-case-7') === -1) {
          var validFile = path.dirname(file) + '/test-case-7/' + path.basename(file);
          var htmlTxt = fs.readFileSync(file, 'utf8');
          var validHtmlTxt = fs.readFileSync(validFile, 'utf8');
          if (htmlTxt !== validHtmlTxt) {
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
