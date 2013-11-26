(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkCSS.js can only be used within node.js"));
  }

  var AbstractFilter = require("./AbstractFilter.js");
  var shrinkCSS = require("../Utils.js").shrinkCSS;

  var ShrinkCSS = function(appConf) {
    this.appConf = appConf || new Config();
  };
  ShrinkCSS.prototype = new AbstractFilter();
  ShrinkCSS.prototype.constructor = AbstractFilter;

  ShrinkCSS.getInstance = function(appConf) {
    return new ShrinkCSS(appConf);
  };

  ShrinkCSS.prototype.processFiles = function(fileArr, callback) {
    var appConf = this.appConf;
    shrinkCSS(fileArr, function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        appConf.createCSSFile(cssTxt, function(err, createdFile, outputFile, newFile) {
          if (err) {
            callback(err);
          } else {
            if (newFile) {
              appConf.analysis.addReport(fileArr, createdFile);
            }
            callback(null, createdFile, outputFile, newFile);
          }
        });
      }
    }, this.appConf.get('yuicompressor-conf'));
  };

  ShrinkCSS.prototype.toString = function() {
    return "ShrinkCSS";
  };

  module["exports"] = ShrinkCSS;
})(this);
