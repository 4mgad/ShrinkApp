console.log('Testing Utils.js');

var fs = require("fs");
var Utils = require("../lib/Utils.js");

var generateFiles = false;
var testCase1 = function() {
  console.log('Test Case #1');
  Utils.less(__dirname + '/app/css/styles.less', function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/css/test-case-2-1.css', cssTxt);
        testCase2();
        return;
      }
      var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-1.css', 'utf8');
      if (cssTxt === validCssTxt) {
        console.log('SUCCESS!');
        testCase2();
      } else {
        console.log("cssTxt: " + cssTxt);
        console.log("validCssTxt: " + validCssTxt);
        console.log('FAILED');
      }
    }
  });
}();

var testCase2 = function() {
  console.log('Test Case #2');
  Utils.less([
    __dirname + '/app/css/styles.less',
    __dirname + '/app/css/styles_1.less'
  ], function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/css/test-case-2-2.css', cssTxt);
        testCase3();
        return;
      }
      var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-2.css', 'utf8');
      if (cssTxt === validCssTxt) {
        console.log('SUCCESS!');
        testCase3();
      } else {
        console.log("cssTxt: " + cssTxt);
        console.log("validCssTxt: " + validCssTxt);
        console.log('FAILED');
      }
    }
  });
};

var testCase3 = function() {
  console.log('Test Case #3');
  Utils.shrinkCSS(__dirname + '/app/css/styles_2.css', function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/css/test-case-2-3.css', cssTxt);
        testCase4();
        return;
      }
      var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-3.css', 'utf8');
      if (cssTxt === validCssTxt) {
        console.log('SUCCESS!');
        testCase4();
      } else {
        console.log("cssTxt: " + cssTxt);
        console.log("validCssTxt: " + validCssTxt);
        console.log('FAILED');
      }
    }
  });
};

var testCase4 = function() {
  console.log('Test Case #4');
  Utils.shrinkCSS([
    __dirname + '/app/css/styles.css',
    __dirname + '/app/css/styles_2.css',
    __dirname + '/app/css/styles_3.css'
  ], function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/css/test-case-2-4.css', cssTxt);
        testCase5();
        return;
      }
      var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-4.css', 'utf8');
      if (cssTxt === validCssTxt) {
        console.log('SUCCESS!');
        testCase5();
      } else {
        console.log("cssTxt: " + cssTxt);
        console.log("validCssTxt: " + validCssTxt);
        console.log('FAILED');
      }
    }
  });
};

var testCase5 = function() {
  console.log('Test Case #5');
  Utils.shrinkJS(__dirname + '/app/js/app.js', function(err, jsTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/js/test-case-2-5.js', jsTxt);
        testCase6();
        return;
      }
      var validJSTxt = fs.readFileSync(__dirname + '/app/js/test-case-2-5.js', 'utf8');
      if (jsTxt === validJSTxt) {
        console.log('SUCCESS!');
        testCase6();
      } else {
        console.log("jsTxt: " + jsTxt);
        console.log("validCssTxt: " + validJSTxt);
        console.log('FAILED');
      }
    }
  });
};

var testCase6 = function() {
  console.log('Test Case #6');
  Utils.shrinkJS([
    __dirname + '/app/js/app.js',
    __dirname + '/app/js/controllers.js',
    __dirname + '/app/js/directives.js',
    __dirname + '/app/js/filters.js',
    __dirname + '/app/js/services.js'
  ], function(err, jsTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync(__dirname + '/app/js/test-case-2-6.js', jsTxt);
        return;
      }
      var validJSTxt = fs.readFileSync(__dirname + '/app/js/test-case-2-6.js', 'utf8');
      if (jsTxt === validJSTxt) {
        console.log('SUCCESS!');
      } else {
        console.log("jsTxt: " + jsTxt);
        console.log("validCssTxt: " + validJSTxt);
        console.log('FAILED');
      }
    }
  });
};
