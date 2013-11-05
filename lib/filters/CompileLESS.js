(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("CompileLESS.js can only be used within node.js"));
  }

  var fs = require('fs');
  var delegate = require("../Utils.js").delegate;
  var less = require("../Utils.js").less;

  var CompileLESS = function(appConf) {
    this.appConf = appConf || {};
    this.lessFiles = [];
  };

  CompileLESS.getInstance = function(appConf) {
    return new CompileLESS(appConf);
  };

  CompileLESS.prototype.applyFilter = function(filePath, callback) {
    var fileArr = [];
    if (typeof filePath === 'string') {
      fileArr.push(filePath);
    } else if (Array.isArray(filePath)) {
      fileArr = filePath;
    }
    callback = callback || function() {
    };
    var cssArr = [];
    var count = fileArr.length;
    var check = delegate(this, function(decrement) {
      if (decrement) {
        count--;
      }
      if (count <= 0) {
        callback(null, cssArr);
      }
    });
    check();
    fileArr.forEach(delegate(this, function(lessFile) {
      this.lessFiles.push(lessFile);
      var cssFile = lessFile + ".css";
      less(lessFile, delegate(this, function(err, cssTxt) {
        if (err) {
          callback(err);
        } else {
          fs.writeFile(cssFile, cssTxt, function(err) {
            if (err) {
              callback(err);
            } else {
              cssArr.push(cssFile);
              check(true);
            }
          });
        }
      }), this.appConf['less-conf']);
    }));
  };

  CompileLESS.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    var lessFiles = this.lessFiles;
    for (var i = 0; i < lessFiles.length; i++) {
      if (fs.existsSync(lessFiles[i])) {
        fs.unlinkSync(lessFiles[i]);
      }
    }
    callback(null, lessFiles);
  };

  module["exports"] = CompileLESS;
})(this);
