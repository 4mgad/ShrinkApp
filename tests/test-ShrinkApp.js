console.log('Testing ShrinkApp.js');

var fs = require("extendfs");
var ShrinkApp = require("../ShrinkApp.js");

fs.deleteDir('build', function(err, dir) {
  if (err) {
    console.log(err);
  }
  fs.copyDir('app', 'build', function(err, src, dest) {
    if (err) {
      console.log(err);
    } else {


      var testCase1 = function() {
        console.log("no test cases to execute yet");
      }();


    }
  });
});

