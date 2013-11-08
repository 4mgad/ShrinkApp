(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Utils.js can only be used within node.js"));
  }

  var fs = require('fs');
  var less = require('less');
  var compressor = require('yuicompressor');
  var ClosureCompiler = require("closurecompiler");

  var Utils = {
    delegate: function(scp, func) {
      return function() {
        return func.apply(scp, arguments);
      };
    },
    less: function(filePath, callback, conf) {
      conf = conf || {};
      var shrinkFile = function(file, callback) {
        fs.readFile(file, 'utf8', function(err, lessTxt) {
          if (err) {
            callback(err);
          } else {
            new (less.Parser)(conf).parse(lessTxt, function(err, tree) {
              if (err) {
                callback(err);
              } else {
                try {
                  callback(null, tree.toCSS({}));
                } catch (err) {
                  callback(err);
                }
              }
            });
          }
        });
      };
      var filePathArr = [];
      if (typeof filePath === 'string') {
        filePathArr.push(filePath);
      } else if (Array.isArray(filePath)) {
        filePathArr = filePath;
      }
      var cssTxt = [];
      var count = filePathArr.length;
      var check = function(decrement) {
        decrement && count--;
        if (count <= 0) {
          callback(null, cssTxt.join('\n'));
        }
      };
      check();
      filePathArr.forEach(function(file, idx) {
        shrinkFile(file, function(err, css) {
          if (err) {
            callback(err);
          } else {
            //css = "/* " + file + " */\n" + css;
            cssTxt[idx] = css;
            check(true);
          }
        });
      });
    },
    shrinkCSS: function(filePath, callback, conf) {
      conf = conf || {
        type: 'css',
        charset: 'utf8'
      };
      var shrinkFile = function(file, callback) {
        fs.readFile(file, 'utf8', function(err, css) {
          if (err) {
            callback(err);
          } else {
            compressor.compress(css, conf, function(err, minCSS) {
              if (err) {
                callback(err);
              } else {
                callback(null, minCSS);
              }
            });
          }
        });
      };
      var filePathArr = [];
      if (typeof filePath === 'string') {
        filePathArr.push(filePath);
      } else if (Array.isArray(filePath)) {
        filePathArr = filePath;
      }
      var minCSS = [];
      var count = filePathArr.length;
      var check = function(decrement) {
        decrement && count--;
        if (count <= 0) {
          callback(null, minCSS.join('\n'));
        }
      };
      check();
      filePathArr.forEach(function(file, idx) {
        shrinkFile(file, function(err, css) {
          if (err) {
            callback(err);
          } else {
            //css = "/* " + file + " */\n" + css;
            minCSS[idx] = css;
            check(true);
          }
        });
      });
    },
    shrinkJS: function(filePath, callback, conf) {
      conf = conf || {};
      var filePathArr = [];
      if (typeof filePath === 'string') {
        filePathArr.push(filePath);
      } else if (Array.isArray(filePath)) {
        filePathArr = filePath;
      }
      ClosureCompiler.compile(filePath, conf, function(err, jsTxt) {
        if (err) {
          callback(err);
        } else {
          callback(null, jsTxt);
        }
      });
    }
  };

  module["exports"] = Utils;
})(this);
