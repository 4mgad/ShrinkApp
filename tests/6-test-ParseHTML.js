var TestSuite = require("./TestSuite.js");

var fs = require("extendfs");
var Config = require("../lib/Config.js");
var normalizeHTML = require("./TestUtils.js").normalizeHTML;
var ParseHTML = require("../lib/filters/ParseHTML.js");

var g = {};

module["exports"] = new TestSuite("ParseHTML.js", [
  //0
  function(callback) {
    var appConf = new Config();
    appConf.config(function(err) {
      if (err) {
        callback(err);
      } else {
        var buildDir = g.buildDir = appConf.getBuildDir();
        g.parseHTML = new ParseHTML.getInstance(appConf);
        g.appName = appConf.get("app-name");
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
    var buildDir = g.buildDir;
    var parseHTML = g.parseHTML;
    var appName = g.appName;
    parseHTML.applyFilter(buildDir + '/index_3.html', function(err, htmlArr) {
      if (err) {
        callback(err);
      } else {
        var HTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/index_3.html', 'utf8'), appName);
        var validHTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-1.html', 'utf8'), appName);
        if (htmlArr.length === 1 && HTMLTxt === validHTMLTxt) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //2
  function(callback) {
    var buildDir = g.buildDir;
    var parseHTML = g.parseHTML;
    var appName = g.appName;
    parseHTML.applyFilter(buildDir + '/index_1.html', function(err, htmlArr) {
      if (err) {
        callback(err);
      } else {
        var HTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/index_1.html', 'utf8'), appName);
        var validHTMLTxt = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-2.html', 'utf8'), appName);
        if (htmlArr.length === 1 && HTMLTxt === validHTMLTxt) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  },
  //3
  function(callback) {
    var buildDir = g.buildDir;
    var parseHTML = g.parseHTML;
    var appName = g.appName;
    parseHTML.applyFilter([
      buildDir + '/index.html',
      buildDir + '/index_1.html',
      buildDir + '/index_2.html',
      buildDir + '/index_3.html'
    ], function(err, htmlArr) {
      if (err) {
        callback(err);
      } else {
        var HTMLTxt1 = normalizeHTML(fs.readFileSync(buildDir + '/index.html', 'utf8'), appName);
        var validHTMLTxt1 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-1.html', 'utf8'), appName);
        var HTMLTxt2 = normalizeHTML(fs.readFileSync(buildDir + '/index_1.html', 'utf8'), appName);
        var validHTMLTxt2 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-2.html', 'utf8'), appName);
        var HTMLTxt3 = normalizeHTML(fs.readFileSync(buildDir + '/index_2.html', 'utf8'), appName);
        var validHTMLTxt3 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-3.html', 'utf8'), appName);
        var HTMLTxt4 = normalizeHTML(fs.readFileSync(buildDir + '/index_3.html', 'utf8'), appName);
        var validHTMLTxt4 = normalizeHTML(fs.readFileSync(buildDir + '/test-case-6-3-4.html', 'utf8'), appName);

        if (HTMLTxt1 === validHTMLTxt1) {
          if (HTMLTxt2 === validHTMLTxt2) {
            if (HTMLTxt3 === validHTMLTxt3) {
              if (HTMLTxt4 === validHTMLTxt4) {
                if (htmlArr.length === 4) {
                  callback();
                  return;
                }
              } else {
                callback("4 does not match");
              }
            } else {
              callback("3 does not match");
            }
          } else {
            callback("2 does not match");
          }
        } else {
          callback("1 does not match");
        }
        callback('FAILED');
      }
    });
  }
]);
