(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkApp.js can only be used within node.js"));
  }

  var fs = require('extendfs');
  var Config = require("./lib/Config.js");
  var delegate = require("./lib/Utils.js").delegate;

  var ShrinkApp = function(conf) {
    this.appConf = conf || new Config();
  };

  ShrinkApp.prototype.applyFilters = function(callback) {
    var fileMap = this.fileMap || {};
    var cnt = Object.keys(fileMap).length;
    for (var ext in fileMap) {
      var fileArr = fileMap[ext];
      this.currFilters = this.appConf.get('filters');
      var fltrs = this.currFilters;
      if (fltrs[ext]) {
        var fltr = this.appConf.getFilter(ext);
        console.log("applying " + fltr + " filter on " + fileArr);
        fltr.applyFilter(fileArr, function(err, arr) {
          if (err) {
            callback(err);
          }
          cnt--;
          if (cnt <= 0) {
            callback(null, arr);
          }
        });
      }
    }
  };

  ShrinkApp.prototype.finalize = function(callback) {
    var fltrMap = this.filterMap;
    var cnt = Object.keys(fltrMap).length;
    if (cnt > 0) {
      var errArr = [];
      for (var key in fltrMap) {
        fltrMap[key].finalize(function(err) {
          cnt--;
          if (err) {
            errArr.push(err);
          }
          if (cnt <= 0) {
            callback(errArr.length ? errArr : null);
          }
        });
      }
    } else {
      callback();
    }
  };

  ShrinkApp.prototype.shrink = function(dirPath, onShrink) {
    var outPath = this.appConf.get("output-path");
    fs.deleteDir(outPath, delegate(this, function(err, deletedDir) {
      if (err) {
        onShrink(err);
      }
      fs.copyDir(dirPath, outPath, delegate(this, function(err, srcDir, destDir) {
        if (err) {
          onShrink(err);
        } else {
          this.applyFilters(function(err, arr) {
            console.log(arguments);
          });
          //this.finalize(onShrink);
        }
      }), null, delegate(this, function(err, srcFile, destFile) {
        this.fileMap = this.fileMap || {};
        var fltrs = this.appConf.get('filters');
        var ext = fs.getExtension(destFile);
        if (fltrs[ext]) {
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
