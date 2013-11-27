var TestSuite = require("./TestSuite.js");

var Analysis = require("../lib/Analysis.js");
var fs = require('extendfs');
var Config = require("../lib/Config.js");

var appConf = new Config();
module["exports"] = new TestSuite("Analysis.js", [
  //0
  function(callback) {
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = appConf.getBuildDir();
        fs.deleteDir(buildDir, function(err, dir) {
          fs.copyDir(__dirname + '/app', buildDir, function(err, src, dest) {
            if (err) {
              callback(err);
            } else {
              callback();
            }
          });
        });
      }
    });
  },
  //1
  function(callback) {
    var buildDir = appConf.getBuildDir();
    var analysis = new Analysis(appConf);
    var fileArr = [
      buildDir + '/js/directives.js'
    ];
    var minFile = buildDir + '/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile, 'report#1');
    if (analysis.getReport('report#1').ratio === 61) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //2
  function(callback) {
    var buildDir = appConf.getBuildDir();
    var analysis = new Analysis(appConf);
    var fileArr = [
      buildDir + '/js/controllers.js',
      buildDir + '/js/filters.js'
    ];
    var minFile = buildDir + '/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile, 'report#2');
    if (analysis.getReport('report#2').ratio === 68) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //3
  function(callback) {
    var buildDir = appConf.getBuildDir();
    var analysis = new Analysis(appConf);
    var fileArr = [
      buildDir + '/js/directives.js'
    ];
    var minFile = buildDir + '/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile);
    var fileArr = [
      buildDir + '/js/controllers.js',
      buildDir + '/js/filters.js'
    ];
    var minFile = buildDir + '/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile);
    if (analysis.getReport().ratio === 65) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //4
  function(callback) {
    var buildDir = appConf.getBuildDir();
    var analysis = new Analysis(appConf);
    var fileArr = [
      buildDir + '/js/directives.js'
    ];
    var minFile = buildDir + '/js/test-case-0-1.js';
    analysis.addReport(fileArr, minFile);
    var fileArr = [
      buildDir + '/js/controllers.js',
      buildDir + '/js/filters.js'
    ];
    var minFile = buildDir + '/js/test-case-0-2.js';
    analysis.addReport(fileArr, minFile);

    var expectedOutput = fs.readFileSync(buildDir + '/js/test-case-0-3.txt', 'utf8');
    var actualOutput = analysis.getReport().toString();
    if (actualOutput === expectedOutput) {
      callback();
    } else {
      fs.writeFileSync(__dirname + '/app/js/test-case-0-3.FAILED.txt', actualOutput, 'utf8');
      callback('FAILED');
    }
  },
  //5
  function(callback) {
    var analysis = new Analysis(appConf);
    if (!analysis.getReport('none')) {
      callback();
    } else {
      callback('FAILED');
    }
  }
]);
