(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Config.js can only be used within node.js"));
  }

  var fs = require("fs");

  var defaultAppConf = {
    "app-name": "app",
    "output-path": "build",
    "css-rel-path": "css",
    "js-rel-path": "js",
    "min-css-ext": ".min.css",
    "min-js-ext": ".min.js",
    "remove": ['lib/less/less-1.5.0.min.js'],
    "compile-js": false,
    "filters": {
      "htm": "ParseHTML",
      "html": "ParseHTML",
      "xhtml": "ParseHTML",
      "__next__": {
        "less": "CompileLESS",
        "__next__": {
          "css": "ShrinkCSS",
          "js": "ShrinkJS"
        }
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
    "uglify-js-conf": {
    },
    "closurecompiler-conf": {
    }
  };

  var Config = function(appConfPath) {
    //clone default configuration
    this.appConf = JSON.parse(JSON.stringify(defaultAppConf));
    if (fs.existsSync(appConfPath)) {
      this.config(JSON.parse(fs.readFileSync(appConfPath, 'utf8')));
    }
  };

  Config.prototype.config = function(conf) {
    var appConf = this.appConf;
    if (typeof conf === 'string') {
      return appConf[conf];
    } else if (typeof conf === 'object') {
      try {
        Object.keys(conf);
      } catch (e) {
        conf = {};
      }
      for (var key in conf) {
        appConf[key] = conf[key];
      }
    }
  };

  Config.prototype.get = function(conf) {
    if (typeof conf === 'string') {
      return this.config(conf);
    }
  };

  Config.prototype.filterDepth = function(ext) {
    var appConf = this.appConf;
    ext = ext.toLowerCase();
    var currFltrs = appConf.filters;
    var filterName = currFltrs[ext];
    var depth = 0;
    while (!filterName && currFltrs['__next__']) {
      currFltrs = currFltrs['__next__'];
      filterName = currFltrs[ext];
      depth++;
    }
    return filterName ? depth : -1;
  };

  Config.prototype.getFilterName = function(ext) {
    var appConf = this.appConf;
    ext = ext.toLowerCase();
    var currFltrs = appConf.filters;
    var filterName = currFltrs[ext];
    while (!filterName && currFltrs['__next__']) {
      currFltrs = currFltrs['__next__'];
      filterName = currFltrs[ext];
    }
    return filterName;
  };

  Config.prototype.getFilter = function(ext) {
    var filterName = this.getFilterName(ext);
    if (filterName) {
      this.filterMap = this.filterMap || {};
      if (!this.filterMap[filterName]) {
        this.filterMap[filterName] = require(__dirname + "/filters/" + filterName + ".js").getInstance(this);
      }
      return this.filterMap[filterName];
    }
  };

  Config.prototype.getFilterObjects = function() {
    var filterMap = this.filterMap || {};
    var filterObjects = [];
    for (var key in filterMap) {
      filterObjects.push(filterMap[key]);
    }
    return filterObjects;
  };

  Config.prototype.toString = function() {
    return "Config";
  };

  module["exports"] = Config;
})(this);
