var TestSuite = require("./TestSuite.js");
TestSuite.runAll([
  require('./0-test-Analysis.js'),
  require('./1-test-Config.js'),
  require('./2-test-Utils.js'),
  require('./3-test-CompileLESS.js'),
  require('./4-test-ShrinkCSS.js'),
  require('./5-test-ShrinkJS.js'),
  require('./6-test-ParseHTML.js'),
  require('./7-test-ShrinkApp.js')
]);