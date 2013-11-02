console.log('Testing ShrinkApp.js');

var fs = require("fs");
var ShrinkApp = require("../ShrinkApp.js");
var Utils = require("../lib/Utils.js");

Utils.deleteDir('_app', null, function(err) {
  if (err) {
    console.log(err);
  }
  Utils.copyDir('app', '_app', null, function(err) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        console.log("no test cases to execute yet");
      }();
      

    }
  });
});

