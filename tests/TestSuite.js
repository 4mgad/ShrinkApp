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

TestSuite.runAll = function(testSuites) {
  var testSuites = testSuites || [];
  var idx = 0;
  var runTestSuite = function(idx) {
    var testSuite = testSuites[idx];
    if (testSuite) {
      testSuite.run(function() {
        runTestSuite(++idx);
      });
    } else {
      console.log(" ");
      console.log(" ");
      if (idx === testSuites.length) {
        console.log(formatMsg("ALL TEST SUITES:", 30) + "SUCCEEDED!!!");
      } else {
        console.log(formatMsg("SOME TEST SUITES:", 30) + "FAILED");
      }
    }
  };
  runTestSuite(idx);
};

module["exports"] = TestSuite;