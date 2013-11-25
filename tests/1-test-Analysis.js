var TestSuite = {
  run: function(callback) {

    console.log('Testing Analysis.js');

    var Analysis = require("../lib/Analysis.js");

    var testCase1 = function() {
      console.log('Test Case #1');
      callback();
    };

  }
};
module["exports"] = TestSuite;