var formatMsg = require('./TestUtils.js').formatMsg;

var TestSuite = function(testSuiteID, testCases) {
  this.testSuiteID = testSuiteID;
  this.testCases = testCases;
};

TestSuite.prototype.run = function(callback) {
  var testSuiteID = this.testSuiteID;
  var testCases = this.testCases;
  console.log(' ');
  console.log('Running Test Suite: ' + testSuiteID);
  var idx = 0;
  var runTestCase = function(idx) {
    var testCase = testCases[idx];
    if (testCase) {
      testCase(function(err) {
        if (err) {
          console.log(err);
          console.log(formatMsg('Test Case #' + idx + ':', 30) + 'FAILED');
        } else {
          console.log(formatMsg('Test Case #' + idx + ':', 30) + 'SUCCEEDED!');
          runTestCase(++idx);
        }
      });
    } else {
      if (idx === testCases.length) {
        console.log(formatMsg("Test Suite " + testSuiteID + ":", 30) + "SUCCEEDED!!");
        callback();
      } else {
        console.log(formatMsg("Test Suite " + testSuiteID + ":", 30) + "FAILED");
      }
    }
  };
  runTestCase(idx);
};
module["exports"] = TestSuite;