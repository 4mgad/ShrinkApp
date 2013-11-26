var TestSuite = require("./TestSuite.js");

var Analysis = require("../lib/Analysis.js");
var fs = require('fs');

module["exports"] = new TestSuite("Analysis.js", [
  //0
  function(callback) {
    var analysis = new Analysis();
    var fileArr = [
      __dirname + '/app/js/directives.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile, 'report#1');
    if (analysis.getReport('report#1').ratio === 61) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //1
  function(callback) {
    var analysis = new Analysis();
    var fileArr = [
      __dirname + '/app/js/controllers.js',
      __dirname + '/app/js/filters.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile, 'report#2');
    if (analysis.getReport('report#2').ratio === 68) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //2
  function(callback) {
    var analysis = new Analysis();
    var fileArr = [
      __dirname + '/app/js/directives.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile);
    var fileArr = [
      __dirname + '/app/js/controllers.js',
      __dirname + '/app/js/filters.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile);
    if (analysis.getReport().ratio === 65) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //3
  function(callback) {
    var analysis = new Analysis();
    var fileArr = [
      __dirname + '/app/js/directives.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile);
    var fileArr = [
      __dirname + '/app/js/controllers.js',
      __dirname + '/app/js/filters.js'
    ];
    var minFile = __dirname + '/app/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile);

    var expectedOutput = fs.readFileSync(__dirname + '/app/js/test-case-0-3.txt', 'utf8');
    var actualOutput = analysis.getReport().toString();
    if (actualOutput === expectedOutput) {
      callback();
    } else {
      fs.writeFileSync(__dirname + '/app/js/test-case-0-3.FAILED.txt', actualOutput, 'utf8');
      callback('FAILED');
    }
  },
  //4
  function(callback) {
    var analysis = new Analysis();
    if (!analysis.getReport('none')) {
      callback();
    } else {
      callback('FAILED');
    }
  }
]);
