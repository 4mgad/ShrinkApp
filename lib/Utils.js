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
    getExtension: function(filePath) {
      var i = filePath.lastIndexOf('.');
      return (i < 0) ? '' : filePath.substr(i + 1);
    },
    copyFile: function(src, dest, callback) {
      var rd = fs.createReadStream(src);
      rd.on("error", function(err) {
        callback(err);
      });
      var wr = fs.createWriteStream(dest);
      wr.on("error", function(err) {
        callback(err);
      });
      wr.on("close", function(err) {
        callback(err);
      });
      rd.pipe(wr);
    },
    copyDir: function(src, dest, copyFileCB, copyDirCB) {
      copyFileCB = copyFileCB || function() {
      };
      copyDirCB = copyDirCB || function() {
      };
      fs.mkdir(dest, function(err) {
        if (err) {
          copyDirCB(err);
        } else {
          if (fs.existsSync(src)) {
            fs.readdir(src, function(err, files) {
              if (err) {
                copyDirCB(err);
              } else {
                var count = files.length;
                var check = function(decrement) {
                  if (decrement) {
                    count--;
                  }
                  if (count <= 0) {
                    copyDirCB(null, src, dest);
                  }
                };
                check();
                files.forEach(function(file) {
                  var sf = src + "/" + file;
                  var df = dest + "/" + file;
                  if (fs.statSync(sf).isDirectory()) {// copy dir recuresively
                    Utils.copyDir(sf, df, copyFileCB, function(err, sd, dd) {
                      copyDirCB(err, sd, dd);
                      if (!err && sf === sd && df === dd) {
                        check(true);
                      }
                    });
                  } else {
                    Utils.copyFile(sf, df, function(err) {
                      if (err) {
                        copyFileCB(err);
                      } else {
                        copyFileCB(null, sf, df);
                        check(true);
                      }
                    });
                  }
                });
              }
            });
          } else {
            copyDirCB(src + " does not exist");
          }
        }
      });
    },
    deleteDir: function(dirPath, deleteFileCB, deleteDirCB) {
      deleteFileCB = deleteFileCB || function() {
      };
      deleteDirCB = deleteDirCB || deleteFileCB;
      if (fs.existsSync(dirPath)) {
        var files = fs.readdirSync(dirPath);
        var count = files.length;
        var check = function(decrement) {
          if (decrement) {
            count--;
          }
          if (count <= 0) {
            fs.rmdir(dirPath, function(err) {
              if (err) {
                deleteDirCB(err);
              } else {
                deleteDirCB(null, dirPath);
              }
            });
          }
        };
        check();
        files.forEach(function(file) {
          var filePath = dirPath + "/" + file;
          if (fs.statSync(filePath).isDirectory()) {// delete dir recuresively
            Utils.deleteDir(filePath, deleteFileCB, function(err, dPath) {
              deleteDirCB(err, dPath);
              if (!err && dPath === filePath) {
                check(true);
              }
            });
          } else { // delete file
            fs.unlink(filePath, function(err) {
              if (err) {
                deleteFileCB(err);
              } else {
                deleteFileCB(null, filePath);
                check(true);
              }
            });
          }
        }
        );
      } else {
        deleteDirCB(dirPath + " does not exist");
      }
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
        if (decrement) {
          count--;
        }
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
            css = "/* " + file + " */\n" + css;
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
        if (decrement) {
          count--;
        }
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
            css = "/* " + file + " */\n" + css;
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
