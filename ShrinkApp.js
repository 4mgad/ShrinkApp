(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkApp.js can only be used within node.js"));
  }

  var fs = require('extendfs');
  var path = require('path');
  var Config = require("./lib/Config.js");
  var delegate = require("./lib/Utils.js").delegate;

  var ShrinkApp = function(conf) {
    this.appConf = conf || new Config();
  };

  ShrinkApp.prototype.applyFilters = function(callback) {
    var appConf = this.appConf;
    var fileMap = this.fileMap || {};
    var keys = Object.keys(fileMap);
    if (!keys.length) {
      callback();
    } else {
      var idx = 0;
      var errArr = [];
      var procFileArr = [];
      var applyFilter = function() {
        var ext = keys[idx];
        var fileArr = fileMap[ext];
        if (appConf.filterDepth(ext) === 0) {
          var fltr = appConf.getFilter(ext);
          fltr.applyFilter(fileArr, function(err, arr) {
            if (err) {
              errArr.push(err);
            } else {
              procFileArr.push.apply(procFileArr, arr);
            }
            if (idx >= (keys.length - 1)) {
              callback(errArr.length ? errArr : null, procFileArr);
            } else {
              idx++;
              applyFilter();
            }
          });
        }
      };
      applyFilter();
    }
  };

  ShrinkApp.prototype.finalize = function(callback) {
    var filterObjects = this.appConf.getFilterObjects();
    var errArr = [];
    if (filterObjects.length) {
      filterObjects.forEach(function(fObj, idx) {
        fObj.finalize(function(err) {
          if (err) {
            errArr.push(err);
          }
          if (idx >= (filterObjects.length - 1)) {
            callback(errArr.length ? errArr : null);
          }
        });
      });
    } else {
      callback();
    }
  };

  ShrinkApp.prototype.shrink = function(dirPath, onShrink) {
    var appConf = this.appConf;
    var outDir = path.dirname(dirPath);
    var outPath = outDir + '/' + appConf.get("output-path");
    appConf.config({
      "output-path": outPath
    });
    fs.deleteDir(outPath, delegate(this, function(err, deletedDir) {
      if (err) {
        onShrink(err);
      }
      fs.copyDir(dirPath, outPath, delegate(this, function(err, srcDir, destDir) {
        if (err) {
          onShrink(err);
        } else {
          this.applyFilters(delegate(this, function(err, arr) {
            if (err) {
              onShrink(err);
            } else {
              this.finalize(function(err) {
                if (err) {
                  onShrink(err);
                } else {
                  onShrink(null, arr, outPath);
                }
              });
            }
          }));
        }
      }), null, delegate(this, function(err, srcFile, destFile) {
        this.fileMap = this.fileMap || {};
        var ext = fs.getExtension(destFile);
        if (appConf.filterDepth(ext) === 0) {
          this.fileMap[ext] = this.fileMap[ext] || [];
          this.fileMap[ext].push(destFile);
        }
      }));
    }));
  };

  ShrinkApp.prototype.toString = function() {
    return "ShrinkApp";
  };

  ShrinkApp.shrink = function(dirPath, onShrink) {
    onShrink = onShrink || function() {
    };
    var appConf = dirPath + '/app.json';
    var shrinkApp = new ShrinkApp(new Config(appConf));
    shrinkApp.shrink(dirPath, onShrink);
  };

  module["exports"] = ShrinkApp;
})(this);
