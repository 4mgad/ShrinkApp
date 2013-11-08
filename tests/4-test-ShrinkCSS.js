console.log('Testing ShrinkCSS.js');

var fs = require("extendfs");
var Config = require("../lib/Config.js");

var ShrinkCSS = require("../lib/filters/ShrinkCSS.js");

var appConf = new Config();
var shrinkCSS = new ShrinkCSS.getInstance(appConf);
var outPath = appConf.get("output-path");
appConf.config({
  "output-path": __dirname + '/' + outPath
});

fs.deleteDir(__dirname + '/build', function(err, dir) {
  if (err) {
    console.log(err);
  }
  fs.copyDir(__dirname + '/app', __dirname + '/build', function(err, src, dest) {
    if (err) {
      console.log(err);
    } else {



      var testCase1 = function() {
        shrinkCSS.applyFilter(__dirname + '/build/css/styles_2.css', function(err, minCSSFiles) {
          console.log('Test Case #1');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCSSFiles[0])) {
              var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
              var validCssTxt = fs.readFileSync(__dirname + '/build/css/test-case-4-1.css', 'utf8');
              if (cssTxt === validCssTxt) {
                console.log('SUCCESS!');
                testCase2();
              } else {
                console.log("generated file: " + minCSSFiles[0]);
                console.log("cssTxt: " + cssTxt);
                console.log("");
                console.log("valid file: " + __dirname + '/build/css/test-case-4-1.css');
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
        if (!fs.existsSync(outPath)) {
          fs.mkdirSync(outPath);
        }
        shrinkCSS.applyFilter([
          __dirname + '/build/css/styles.css',
          __dirname + '/build/css/styles_2.css',
          __dirname + '/build/css/styles_3.css'
        ], function(err, minCSSFiles) {
          console.log('Test Case #2');
          if (err) {
            console.log(err);
          } else {
            if (fs.existsSync(minCSSFiles[0])) {
              var cssTxt = fs.readFileSync(minCSSFiles[0], 'utf8');
              var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-4-2.css', 'utf8');
              if (cssTxt === validCssTxt) {
                console.log('SUCCESS!');
                testCase3();
              } else {
                console.log("generated file: " + minCSSFiles[0]);
                console.log("cssTxt: " + cssTxt);
                console.log("");
                console.log("valid file: " + __dirname + '/app/css/test-case-4-2.css');
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
            } else {
              console.log('FAILED');
            }
          }
        });
      };



    }
  });
});

