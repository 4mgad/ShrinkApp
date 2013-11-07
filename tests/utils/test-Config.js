console.log('Testing Config.js');

var Config = require("../../lib/Config.js");

var testCase1 = function() {
  console.log('Test Case #1');
  var c = new Config(__dirname + "/app.json");
  if (c.get('app-name') === 'myApp') {
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
  if (!c.getFilter('none')) {
    console.log('SUCCESS!');
  } else {
    console.log('FAILED');
  }
}();

