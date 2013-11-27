(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkJS.js can only be used within node.js"));
  }

  var AbstractFilter = require("./AbstractFilter.js");
  var shrinkJS = require("../Utils.js").shrinkJS;

  var ShrinkJS = function(appConf) {
    this.appConf = appConf || new Config();
  };
  ShrinkJS.prototype = new AbstractFilter();
  ShrinkJS.prototype.constructor = AbstractFilter;

  ShrinkJS.getInstance = function(appConf) {
    return new ShrinkJS(appConf);
  };

  ShrinkJS.prototype.processFiles = function(fileArr, callback) {
    var appConf = this.appConf;
    shrinkJS(fileArr, function(err, jsTxt) {
      if (err) {
        callback(err);
      } else {
        appConf.createJSFile(jsTxt, function(err, createdFile, outputFile, newFile) {
          if (err) {
            callback(err);
          } else {
            if (newFile) {
              appConf.getAnalysis().addReport(fileArr, createdFile);
            }
            callback(null, createdFile, outputFile, newFile);
          }
        });
      }
    }, this.appConf.get('uglify-js-conf'));
  };

  ShrinkJS.prototype.toString = function() {
    return "ShrinkJS";
  };

  module["exports"] = ShrinkJS;
})(this);
