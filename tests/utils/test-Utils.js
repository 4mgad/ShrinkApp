console.log('Testing Utils.js');

var fs = require("fs");
var Utils = require("../../lib/Utils.js");

var generateFiles = false;
var testCase1 = function() {
  console.log('Test Case #1');
  Utils.less('css/styles.less', function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('css/test-case-1.css', cssTxt);
        return;
      }
      var validCssTxt = fs.readFileSync('css/test-case-1.css', 'utf8');
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
    'css/styles.less',
    'css/styles_1.less'
  ], function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('css/test-case-2.css', cssTxt);
        return;
      }
      var validCssTxt = fs.readFileSync('css/test-case-2.css', 'utf8');
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
  Utils.shrinkCSS('css/styles_2.css', function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('css/test-case-3.css', cssTxt);
        return;
      }
      var validCssTxt = fs.readFileSync('css/test-case-3.css', 'utf8');
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
    'css/styles.css',
    'css/styles_2.css',
    'css/styles_3.css'
  ], function(err, cssTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('css/test-case-4.css', cssTxt);
        return;
      }
      var validCssTxt = fs.readFileSync('css/test-case-4.css', 'utf8');
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
  Utils.shrinkJS('js/app.js', function(err, jsTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('js/test-case-5.js', jsTxt);
        return;
      }
      var validJSTxt = fs.readFileSync('js/test-case-5.js', 'utf8');
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
    'js/app.js',
    'js/controllers.js',
    'js/directives.js',
    'js/filters.js',
    'js/services.js'
  ], function(err, jsTxt) {
    if (err) {
      console.log(err);
    } else {
      if (generateFiles) {
        fs.writeFileSync('js/test-case-6.js', jsTxt);
        return;
      }
      var validJSTxt = fs.readFileSync('js/test-case-6.js', 'utf8');
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
