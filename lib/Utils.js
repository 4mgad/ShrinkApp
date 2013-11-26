(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Utils.js can only be used within node.js"));
  }

  var fs = require('fs');
  var less = require('less');
  var compressor = require('yuicompressor');
  var UglifyJS = require("uglify-js");

  var Utils = (function() {

    var uglifyJS = function(filePath, callback, conf) {
      conf = conf || {};
      var filePathArr = [];
      if (typeof filePath === 'string') {
        filePathArr.push(filePath);
      } else if (Array.isArray(filePath)) {
        filePathArr = filePath;
      }
      try {
        var jsTxt = UglifyJS.minify(filePath, conf).code;
        callback(null, jsTxt);
      } catch (err) {
        callback(err);
      }
    };

    var columnMsg = function(msg, size) {
      size = size || 5;
      var formattedMsg = new Array(size);
      formattedMsg = formattedMsg.join(' ');
      formattedMsg = msg + formattedMsg.substr(msg.length);
      return formattedMsg;
    };

    var underlineMsg = function(msg) {
      var formattedMsg = new Array(msg.length + 1);
      formattedMsg = formattedMsg.join('=');
      formattedMsg = msg + '\n' + formattedMsg;
      return formattedMsg;
    };

    var arrowMsg = function(msg, arrowTitle) {
      arrowTitle = arrowTitle || '   ';
      var str = '\n';
      str += '   ' + new Array(arrowTitle.length + 1).join('-') + '\\\n';
      str += '   ' + arrowTitle + ' >  ' + msg + '\n';
      str += '   ' + new Array(arrowTitle.length + 1).join('-') + '/\n';
      return str;
    };

    var tripleArrowMsg = function(topTitle, topMsg, botTitle, botMsg, midTitle, midMsg) {
      var width = (topTitle.length > botTitle.length ? topTitle.length : botTitle.length) + 1;
      topTitle = columnMsg(topTitle, width);
      botTitle = columnMsg(botTitle, width);
      var pad = '   ';
      var topArrow = pad + topTitle + ' >  ' + topMsg + '\n';
      var botArrow = pad + botTitle + ' >  ' + botMsg + '\n';
      var arrowWidth = topArrow.length > botArrow.length ? topArrow.length : botArrow.length;
      var str = '\n';
      str += pad + new Array(topTitle.length + 1).join('-') + '\\\n';
      str += topArrow;
      str += columnMsg(pad + new Array(topTitle.length + 1).join('-') + '/', arrowWidth);
      str += '  ' + new Array(midTitle.length + 1).join('-') + '\\\n';

      str += '  ' + new Array(topArrow.length).join(' ') + midTitle + ' >  ' + midMsg + '\n';

      str += columnMsg(pad + new Array(botTitle.length + 1).join('-') + '\\', arrowWidth);
      str += '  ' + new Array(midTitle.length + 1).join('-') + '/\n';
      str += botArrow;
      str += pad + new Array(botTitle.length + 1).join('-') + '/';
      str += '\n';
      return str;
    };

    return {
      underlineMsg: underlineMsg,
      tripleArrowMsg: tripleArrowMsg,
      isAbsolute: function(p) {
        if (p && p.length) {
          if ('/' === p[0])
            return true;
          if (':' === p[1] && '\\' === p[2])
            return true;
        }
      },
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
        uglifyJS(filePath, callback, conf);
      }
    };
  })();

  module["exports"] = Utils;
})(this);
