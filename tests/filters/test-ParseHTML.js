console.log('Testing ParseHTML.js');

var fs = require("extendfs");
var ShrinkApp = require("../../ShrinkApp.js");
var ParseHTML = require("../../lib/filters/ParseHTML.js");

var appConf = new ShrinkApp().appConf;
var outPath = appConf["output-path"];

var parseHTML = new ParseHTML.getInstance(appConf);

fs.deleteDir('build', function(err, dir) {
  if (err) {
    console.log(err);
  }
  fs.copyDir('app', 'build', function(err, src, dest) {
    if (err) {
      console.log(err);
    } else {



      var testCase1 = function() {
        console.log('Test Case #1');
        parseHTML.applyFilter('build/index_3.html', function(err, htmlArr) {
          if (err) {
            console.log(err);
          } else {
            var HTMLTxt = fs.readFileSync('build/index_3.html', 'utf8');
            var validHTMLTxt = fs.readFileSync('build/test-case-1.html', 'utf8');
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
        parseHTML.applyFilter('build/index_1.html', function(err, htmlArr) {
          if (err) {
            console.log(err);
          } else {
            var HTMLTxt = fs.readFileSync('build/index_1.html', 'utf8');
            var validHTMLTxt = fs.readFileSync('build/test-case-2.html', 'utf8');
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
          'build/index.html',
          'build/index_1.html',
          'build/index_2.html',
          'build/index_3.html'
        ], function(err, htmlArr) {
          if (err) {
            console.log(err);
          } else {
            var HTMLTxt = fs.readFileSync('build/index_2.html', 'utf8');
            var validHTMLTxt = fs.readFileSync('build/test-case-3.html', 'utf8');
            if (htmlArr.length === 4 && HTMLTxt === validHTMLTxt) {
              console.log('SUCCESS!');
            } else {
              console.log('FAILED');
            }
          }
        });
      };



    }
  });
});

