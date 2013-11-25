var formatMsg = require('./TestUtils.js').formatMsg;

var testArr = [
//  './1-test-Analysis.js',
//  './1-test-Config.js',
//  './2-test-Utils.js',
//  './3-test-CompileLESS.js',
  './4-test-ShrinkCSS.js',
//  './5-test-ShrinkJS.js',
//  './6-test-ParseHTML.js',
//  './7-test-ShrinkApp.js'
];

var idx = 0;
var runTestSuite = function(idx) {
  var testSuite = testArr[idx];
  if (testSuite) {
    require(testSuite).run(function() {
      runTestSuite(++idx);
    });
  } else {
    console.log(" ");
    console.log(" ");
    if (idx === testArr.length) {
      console.log(formatMsg("ALL TEST SUITES:", 30) + "SUCCEEDED!!!");
    } else {
      console.log(formatMsg("SOME TEST SUITES:", 30) + "FAILED");
    }
  }
};
runTestSuite(idx);