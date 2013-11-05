(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ShrinkApp.js can only be used within node.js"));
  }

  var fs = require('fs');
  var Utils = require("./lib/Utils.js");
  var delegate = require("./lib/Utils.js").delegate;

  var ShrinkApp = function() {
  };

  ShrinkApp.prototype.appConf = {
    "app-name": "app",
    "output-path": "build",
    "css-rel-path": "css",
    "js-rel-path": "js",
    "filter-chain": {
      "htm": "ParseHTML",
      "html": "ParseHTML",
      "xhtml": "ParseHTML",
      "less": "CompileLESS",
      "__next__": {
        "htm": "ParseHTML",
        "html": "ParseHTML",
        "xhtml": "ParseHTML",
        "css": "ShrinkCSS",
        "js": "ShrinkJS"
      }
    },
    "js-beautify-conf": {
      indent_size: 2,
      preserve_newlines: false,
      max_preserve_newlines: 1
    },
    "less-conf": {
    },
    "yuicompressor-conf": {
      charset: 'utf8',
      type: 'css'
    },
    "closurecompiler-conf": {
    }
  };

  ShrinkApp.prototype.config = function(conf) {
    if (typeof conf === 'string') {
      return this.appConf[conf];
    } else if (typeof conf === 'object') {
      try {
        Object.keys(conf);
      } catch (e) {
        conf = {};
      }
      for (var key in conf) {
        this.appConf[key] = conf[key];
      }
    }
  };

  ShrinkApp.prototype.applyFilters = function(path) {
    var applyFilter = function(fltr) {
      try {
        if (!fltr.filterObj) {
          fltr.filterObj = require(__dirname + "/lib/" + fltr.filter).getInstance(this.appConf);
        }
        fltr.filterObj.applyFilter(path);
      } catch (err) {
        console.log(err);
      }
    };
    var fltrs = this.config("filters");
    if (fltrs && fltrs.length) {
      fltrs.forEach(delegate(this, function(fltr) {
        if (Array.isArray(fltr.extension)) {
          var extensions = fltr.extension;
          extensions.forEach(delegate(this, function(ext) {
            if (path.match("\." + ext + "$", "i")) {
              delegate(this, applyFilter)(fltr);
            }
          }));
        } else if (typeof fltr.extension === 'string') {
          if (path.match("\." + fltr.extension + "$", "i")) {
            delegate(this, applyFilter)(fltr);
          }
        }
      }));
    }
  };

  ShrinkApp.prototype.finalize = function() {
    var fltrs = this.config("filters");
    if (fltrs && fltrs.length) {
      fltrs.forEach(function(fltr) {
        if (fltr.filterObj) {
          fltr.filterObj.finalize();
        }
      });
    }
  };

  ShrinkApp.prototype.shrink = function(path) {
    var outPath = this.config("output-path");
    Utils.deleteDir(outPath, null, delegate(this, function(err) {
      Utils.copyDir(path, outPath, null, delegate(this, function(err) {
        if (err) {
          console.log(err);
        } else {
          this.finalize();
        }
      }));
    }));
  };

  ShrinkApp.prototype.toString = function() {
    return "ShrinkApp";
  };

  ShrinkApp.shrink = function(path) {
    var appConf = path + '/app.json';
    var shrinkApp = new ShrinkApp();
    if (fs.existsSync(appConf)) {
      shrinkApp.config(JSON.parse(fs.readFileSync(appConf, 'utf8')));
    }
    shrinkApp.shrink(path);
  };

  module["exports"] = ShrinkApp;
})(this);