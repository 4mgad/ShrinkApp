var TestSuite = {
  run: function(callback) {

    console.log('Testing Config.js');

    var Config = require("../lib/Config.js");

    var testCase1 = function() {
      console.log('Test Case #1');
      var c = new Config(__dirname + "/app/app.json");
      if (c.get('app-name') === 'myApp' && c.get('output-path') === 'build') {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase2 = function() {
      console.log('Test Case #2');
      var c = new Config();
      if (c.getFilter('html') === c.getFilter('html')) {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase3 = function() {
      console.log('Test Case #3');
      var c = new Config();
      if (c.getFilter('css') === c.getFilter('css')) {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase4 = function() {
      console.log('Test Case #4');
      var c = new Config();
      if (c.getFilter('less') === c.getFilter('LESS')) {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase5 = function() {
      console.log('Test Case #5');
      var c = new Config();
      if (c.getFilterName('less') === 'CompileLESS') {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase6 = function() {
      console.log('Test Case #6');
      var c = new Config();
      if (!c.getFilter('none')) {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    var testCase7 = function() {
      console.log('Test Case #7');
      var c = new Config();
      if (c.filterDepth('less') === 1 && c.filterDepth('css') === 2 && c.filterDepth('none') === -1) {
        console.log('SUCCESS!');
      } else {
        console.log('FAILED');
      }
    }();

    callback();
  }
};
module["exports"] = TestSuite;