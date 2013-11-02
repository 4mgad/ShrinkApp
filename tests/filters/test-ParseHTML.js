console.log('Testing ParseHTML.js');

var fs = require("fs");
var ShrinkApp = require("../../ShrinkApp.js");
var Utils = require("../../lib/Utils.js");
var ParseHTML = require("../../lib/filters/ParseHTML.js");

var appConf = new ShrinkApp().appConf;
var outPath = appConf["output-path"];

var parseHTML = new ParseHTML.getInstance(appConf);

Utils.deleteDir('_html', null, function(err, dir) {
  if (err) {
    console.log(err);
  }
  if (dir === '_html' || err) {
    Utils.copyDir('html', '_html', null, function(err, src, dest) {
      if (err) {
        console.log(err);
      } else {
        if (dest === '_html') {



          var testCase1 = function() {
            parseHTML.applyFilter('_html/index.html', function() {
              console.log(arguments);
            });
          }();



        }
      }
    });
  }
});

