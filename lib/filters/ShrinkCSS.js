(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkCSS.js can only be used within node.js"));
  }

  var fs = require('fs');
  var delegate = require("../Utils.js").delegate;
  var shrinkCSS = require("../Utils.js").shrinkCSS;

  var ShrinkCSS = function(appConf) {
    this.appConf = appConf || {};
    this.cssFiles = [];
    this.appConf._CSS_CNT = 0;
  };

  ShrinkCSS.getInstance = function(appConf) {
    return new ShrinkCSS(appConf);
  };

  ShrinkCSS.prototype.applyFilter = function(filePath, callback) {
    var fileArr = [];
    if (typeof filePath === 'string') {
      fileArr.push(filePath);
    } else if (Array.isArray(filePath)) {
      fileArr = filePath;
    }
    callback = callback || function() {
    };
    var appName = this.appConf["app-name"] + "_" + this.appConf._CSS_CNT++;
    var appPath = this.appConf["output-path"];
    var cssRelPath = this.appConf["css-rel-path"];
    var cssPath = appPath + "/" + cssRelPath;
    if (!fs.existsSync(cssPath)) {
      fs.mkdirSync(cssPath);
    }
    var minCSSFile = cssPath + "/" + appName + ".min.css";

    shrinkCSS(fileArr, delegate(this, function(err, cssTxt) {
      if (err) {
        callback(err);
      } else {
        fs.writeFile(minCSSFile, cssTxt, delegate(this, function(err) {
          if (err) {
            callback(err);
          } else {
            this.cssFiles.push.apply(this.cssFiles, fileArr);
            callback(null, [minCSSFile]);
          }
        }));
      }
    }), this.appConf['yuicompressor-conf']);
  };

  ShrinkCSS.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    var cssFiles = this.cssFiles;
    for (var i = 0; i < cssFiles.length; i++) {
      if (fs.existsSync(cssFiles[i])) {
        fs.unlinkSync(cssFiles[i]);
      }
    }
    callback(null, cssFiles);
  };

  module["exports"] = ShrinkCSS;
})(this);
