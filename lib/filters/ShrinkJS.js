(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkJS.js can only be used within node.js"));
  }

  var fs = require('fs');
  var delegate = require("../Utils.js").delegate;
  var shrinkJS = require("../Utils.js").shrinkJS;

  var ShrinkJS = function(appConf) {
    this.appConf = appConf;
    this.jsFiles = [];
    this.appConf._CNT = 0;
  };

  ShrinkJS.getInstance = function(appConf) {
    return new ShrinkJS(appConf);
  };

  ShrinkJS.prototype.applyFilter = function(filePath, callback) {
    var fileArr = [];
    if (typeof filePath === 'string') {
      fileArr.push(filePath);
    } else if (Array.isArray(filePath)) {
      fileArr = filePath;
    }
    callback = callback || function() {
    };
    var appName = this.appConf["app-name"] + "_" + this.appConf._CNT++;
    var appPath = this.appConf["output-path"];
    var jsRelPath = this.appConf["js-rel-path"];
    var jsPath = appPath + "/" + jsRelPath;
    if (!fs.existsSync(jsPath)) {
      fs.mkdirSync(jsPath);
    }
    var minCssFile = jsPath + "/" + appName + ".min.js";
    var minCssRelPath = jsRelPath + "/" + appName + ".min.js";

    shrinkJS(fileArr, delegate(this, function(err, jsTxt) {
      if (err) {
        callback(err);
      } else {
        fs.writeFile(minCssFile, jsTxt, delegate(this, function(err) {
          if (err) {
            callback(err);
          } else {
            this.jsFiles.push.apply(this.jsFiles, fileArr);
            callback(null, minCssFile, minCssRelPath);
          }
        }));
      }
    }), this.appConf['closurecompiler-conf']);
  };

  ShrinkJS.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    var jsFiles = this.jsFiles;
    for (var i = 0; i < jsFiles.length; i++) {
      if (fs.existsSync(jsFiles[i])) {
        fs.unlinkSync(jsFiles[i]);
      }
    }
    callback(null, jsFiles);
  };

  module["exports"] = ShrinkJS;
})(this);
