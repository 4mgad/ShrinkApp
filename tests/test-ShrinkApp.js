console.log('Testing ShrinkApp.js');

var ShrinkApp = require("../ShrinkApp.js");

var testCase1 = function() {
  ShrinkApp.shrink('app', function() {
    console.log(arguments);
  });
}();
