console.log('Testing ParseHTML.js');

var fs = require("fs");
var ShrinkApp = require("../../ShrinkApp.js");
var Utils = require("../../lib/Utils.js");
var ParseHTML = require("../../lib/filters/ParseHTML.js");

var appConf = new ShrinkApp().appConf;
var outPath = appConf["output-path"];

var parseHTML = new ParseHTML.getInstance(appConf);

Utils.deleteDir('build', null, function(err, dir) {
  if (err) {
    console.log(err);
  }
  if (dir === 'build' || err) {
    Utils.copyDir('app', 'build', null, function(err, src, dest) {
      if (err) {
        console.log(err);
      } else {
        if (dest === 'build') {



          var testCase1 = function() {
            appConf.filters = appConf.chain['filters1'];
            parseHTML.applyFilter('build/index_3.html', function(err, htmlArr) {
              if (err) {
                console.log(err);
              } else {
                console.log(htmlArr);
                appConf.filters = appConf.chain['filters2'];
                parseHTML.applyFilter(htmlArr, function(err, htmlArr) {
                  console.log(htmlArr);
                });
              }
            });
          }();



        }
      }
    });
  }
});

