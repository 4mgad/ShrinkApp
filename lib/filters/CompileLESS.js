(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("CompileLESS.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var AbstractFilter = require("./AbstractFilter.js");
  var delegate = require("../Utils.js").delegate;
  var less = require("../Utils.js").less;

  var CompileLESS = function(appConf) {
    this.appConf = appConf || new Config();
  };
  CompileLESS.prototype = new AbstractFilter();
  CompileLESS.prototype.constructor = AbstractFilter;

  CompileLESS.getInstance = function(appConf) {
    return new CompileLESS(appConf);
  };

  CompileLESS.prototype.processFiles = function(fileArr, callback) {
    var appConf = this.appConf;
    var cssArr = [];
    var count = fileArr.length;
    var check = delegate(this, function(decrement) {
      decrement && count--;
      if (count <= 0) {
        appConf.getAnalysis().addReport(fileArr, cssArr);
        callback(null, cssArr);
      }
    });
    check();
    fileArr.forEach(delegate(this, function(lessFile) {
      var cssFile = lessFile + ".css";
      less(lessFile, function(err, cssTxt) {
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
      }, this.appConf.get('less-conf'));
    }));
  };

  CompileLESS.prototype.toString = function() {
    return "CompileLESS";
  };

  module["exports"] = CompileLESS;
})(this);
