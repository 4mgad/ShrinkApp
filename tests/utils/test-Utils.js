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
      var validCssTxt = fs.readFileSync('css/test-case-1.css');
      if (cssTxt == validCssTxt) {
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
      var validCssTxt = fs.readFileSync('css/test-case-2.css');
      if (cssTxt == validCssTxt) {
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
      var validCssTxt = fs.readFileSync('css/test-case-3.css');
      if (cssTxt == validCssTxt) {
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
      var validCssTxt = fs.readFileSync('css/test-case-4.css');
      if (cssTxt == validCssTxt) {
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
      var validJSTxt = fs.readFileSync('js/test-case-5.js');
      if (jsTxt == validJSTxt) {
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
      var validJSTxt = fs.readFileSync('js/test-case-6.js');
      if (jsTxt == validJSTxt) {
        console.log('SUCCESS!');
        testCase7();
      } else {
        console.log("jsTxt: " + jsTxt);
        console.log("validCssTxt: " + validJSTxt);
        console.log('FAILED');
      }
    }
  });
};

var testCase7 = function() {
  console.log('Test Case #7');
  Utils.copyFile('css/styles.css', 'css/_styles.css', function(err) {
    if (err) {
      console.log(err);
    } else {
      if (fs.existsSync('css/_styles.css')) {
        fs.unlinkSync('css/_styles.css');
        console.log('SUCCESS!');
        testCase8();
      } else {
        console.log('FAILED');
      }
    }
  });
};

var testCase8 = function() {
  console.log('Test Case #8');
  var numOfCopiedFiles = 0;
  Utils.copyDir('js', '_js', function(err, sf, df) {
    if (err) {
      console.log(err);
    } else {
      //console.log(sf + " copied to " + df);
      numOfCopiedFiles++;
    }
  }, function(err, sd, dd) {
    if (err) {
      console.log(err);
    } else {
      //console.log(sd + " dir copied to " + dd);
      if (dd === "_js") {
        if (fs.existsSync('_js') && numOfCopiedFiles == 11) {
          console.log('SUCCESS!');
          testCase9();
        } else {
          console.log('FAILED');
        }
      }
    }
  });
};

var testCase9 = function() {
  console.log('Test Case #9');
  var numOfDeletedFiles = 0;
  Utils.deleteDir('_js', function(err, filePath) {
    if (err) {
      console.log(err);
    } else {
      numOfDeletedFiles++;
    }
  }, function(err, dirPath) {
    if (err) {
      console.log(err);
    } else {
      if (dirPath == "_js") {
        if (!fs.existsSync('_js') && numOfDeletedFiles == 11) {
          console.log('SUCCESS!');
        } else {
          console.log('FAILED');
        }
      }
    }
  });
};