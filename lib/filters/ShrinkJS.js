(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkJS.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var delegate = require("../Utils.js").delegate;
  var shrinkJS = require("../Utils.js").shrinkJS;

  var ShrinkJS = function(appConf) {
    this.appConf = appConf || {};
    this.jsFiles = [];
    this.appConf._JS_CNT = 0;
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
    var appName = this.appConf["app-name"] + "_" + this.appConf._JS_CNT++;
    var appPath = this.appConf["output-path"];
    var jsRelPath = this.appConf["js-rel-path"];
    var minJSExt = this.appConf["min-js-ext"];
    var jsPath = appPath + "/" + jsRelPath;
    if (!fs.existsSync(jsPath)) {
      fs.mkdirSync(jsPath);
    }
    var minJSFile = jsPath + "/" + appName + minJSExt;

    shrinkJS(fileArr, delegate(this, function(err, jsTxt) {
      if (err) {
        callback(err);
      } else {
        fs.writeFile(minJSFile, jsTxt, delegate(this, function(err) {
          if (err) {
            callback(err);
          } else {
            this.jsFiles.push.apply(this.jsFiles, fileArr);
            callback(null, [minJSFile]);
          }
        }));
      }
    }), this.appConf['closurecompiler-conf']);
  };

  ShrinkJS.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    try {
      var jsFiles = this.jsFiles;
      for (var i = 0; i < jsFiles.length; i++) {
        if (fs.existsSync(jsFiles[i])) {
          fs.unlinkSync(jsFiles[i]);
        }
      }
      callback(null, jsFiles);
    } catch (err) {
      callback(err);
    }
  };

  module["exports"] = ShrinkJS;
})(this);
