var TestSuite = require("./TestSuite.js");

var fs = require("fs");
var Utils = require("../lib/Utils.js");

var generateFiles = false;

module["exports"] = new TestSuite("Utils.js", [
  //0
  function(callback) {
    if (Utils.isAbsolute('C:\\test\\test')
      && !Utils.isAbsolute('test\\test')
      && Utils.isAbsolute('/test/test')
      && !Utils.isAbsolute('test/test')
      && !Utils.isAbsolute('.\\test')
      && !Utils.isAbsolute('./test')
      && !Utils.isAbsolute('..\\test')
      && !Utils.isAbsolute('../test')
      ) {
      callback();
    } else {
      callback('FAILED');
    }
  },
  //1
  function(callback) {
    Utils.less(__dirname + '/app/css/styles.less', function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/css/test-case-2-1.css', cssTxt);
          callback();
          return;
        }
        var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-1.css', 'utf8');
        if (cssTxt === validCssTxt) {
          callback();
        } else {
          console.log("cssTxt: " + cssTxt);
          console.log("validCssTxt: " + validCssTxt);
          callback('FAILED');
        }
      }
    });
  },
  //2
  function(callback) {
    Utils.less([
      __dirname + '/app/css/styles.less',
      __dirname + '/app/css/styles_1.less'
    ], function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/css/test-case-2-2.css', cssTxt);
          callback();
          return;
        }
        var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-2.css', 'utf8');
        if (cssTxt === validCssTxt) {
          callback();
        } else {
          console.log("cssTxt: " + cssTxt);
          console.log("validCssTxt: " + validCssTxt);
          callback('FAILED');
        }
      }
    });
  },
  //3
  function(callback) {
    Utils.shrinkCSS(__dirname + '/app/css/styles_2.css', function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/css/test-case-2-3.css', cssTxt);
          callback();
          return;
        }
        var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-3.css', 'utf8');
        if (cssTxt === validCssTxt) {
          callback();
        } else {
          console.log("cssTxt: " + cssTxt);
          console.log("validCssTxt: " + validCssTxt);
          callback('FAILED');
        }
      }
    });
  },
  //4
  function(callback) {
    Utils.shrinkCSS([
      __dirname + '/app/css/styles.css',
      __dirname + '/app/css/styles_2.css',
      __dirname + '/app/css/styles_3.css'
    ], function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/css/test-case-2-4.css', cssTxt);
          callback();
          return;
        }
        var validCssTxt = fs.readFileSync(__dirname + '/app/css/test-case-2-4.css', 'utf8');
        if (cssTxt === validCssTxt) {
          callback();
        } else {
          console.log("cssTxt: " + cssTxt);
          console.log("validCssTxt: " + validCssTxt);
          callback('FAILED');
        }
      }
    });
  },
  //5
  function(callback) {
    Utils.shrinkJS(__dirname + '/app/js/app.js', function(err, jsTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/js/test-case-2-5.js', jsTxt);
          callback();
          return;
        }
        var validJSTxt = fs.readFileSync(__dirname + '/app/js/test-case-2-5.js', 'utf8');
        if (jsTxt === validJSTxt) {
          callback();
        } else {
          console.log("jsTxt: " + jsTxt);
          console.log("validCssTxt: " + validJSTxt);
          callback('FAILED');
        }
      }
    });
  },
  //6
  function(callback) {
    Utils.shrinkJS([
      __dirname + '/app/js/app.js',
      __dirname + '/app/js/controllers.js',
      __dirname + '/app/js/directives.js',
      __dirname + '/app/js/filters.js',
      __dirname + '/app/js/services.js'
    ], function(err, jsTxt) {
      if (err) {
        callback(err);
      } else {
        if (generateFiles) {
          fs.writeFileSync(__dirname + '/app/js/test-case-2-6.js', jsTxt);
          callback();
          return;
        }
        var validJSTxt = fs.readFileSync(__dirname + '/app/js/test-case-2-6.js', 'utf8');
        if (jsTxt === validJSTxt) {
          callback();
        } else {
          console.log("jsTxt: " + jsTxt);
          console.log("validCssTxt: " + validJSTxt);
          callback('FAILED');
        }
      }
    });
  }

]);
