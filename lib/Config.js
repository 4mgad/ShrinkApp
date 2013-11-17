(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Config.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var crypto = require('crypto');
  var delegate = require("./Utils.js").delegate;

  var defaultAppConf = {
    "app-name": "app",
    "output-path": "build",
    "css-rel-path": "css",
    "js-rel-path": "js",
    "min-css-ext": ".min.css",
    "min-js-ext": ".min.js",
    "remove": ["less\\-[0-9]\\.[0-9]\\.[0-9]\\.min\\.js$"],
    "exclude": [
      "^https?://.*$",
      "^//.*$"
    ],
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
    }
  };

  var appConfHelp = {
    "app-name": "Application Name",
    "output-path": "Output Path",
    "css-rel-path": "CSS Relative Path",
    "js-rel-path": "JS Relative Path",
    "min-css-ext": "Minified CSS Extension",
    "min-js-ext": "Minified JS Extension"
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
      //always return a clone
      return JSON.parse(JSON.stringify(this.config(conf)));
    }
  };

  Config.getDefaultAppConf = function() {
    return JSON.parse(JSON.stringify(defaultAppConf));
  };

  Config.getAppConfHelp = function() {
    return JSON.parse(JSON.stringify(appConfHelp));
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

  Config.prototype.createFile = function(fileContent, filePath, callback) {
    callback = callback || function() {
    };
    fileContent = fileContent || '';
    this.hashMap = this.hashMap || {};
    var hash = crypto.createHash('md5').update(fileContent).digest('hex');
    var currFile = this.hashMap[hash];
    if (currFile) {
      callback(null, currFile);
    } else {
      try {
        fs.writeFileSync(filePath, fileContent);
        this.hashMap[hash] = filePath;
        callback(null, filePath);
      } catch (err) {
        callback(err);
      }
    }
  };

  Config.prototype.createJSFile = function(fileContent, callback) {
    callback = callback || function() {
    };
    this._JS_CNT = this._JS_CNT || 0;
    var appName = this.get("app-name");
    var appPath = this.get("output-path");
    var relPath = this.get("js-rel-path");
    var minExt = this.get("min-js-ext");
    var dirPath = appPath + "/" + relPath;
    var filePath = dirPath + "/" + appName + "_" + this._JS_CNT + minExt;
    fs.createDirs(dirPath, delegate(this, function(err, createdDir) {
      if (err) {
        callback(err);
      } else {
        this.createFile(fileContent, filePath, delegate(this, function(err, createdFile) {
          if (err) {
            callback(err);
          } else {
            if (createdFile === filePath) {
              this._JS_CNT++;
            }
            callback(null, createdFile);
          }
        }));
      }
    }));
  };

  Config.prototype.createCSSFile = function(fileContent, callback) {
    callback = callback || function() {
    };
    this._CSS_CNT = this._CSS_CNT || 0;
    var appName = this.get("app-name");
    var appPath = this.get("output-path");
    var relPath = this.get("css-rel-path");
    var minExt = this.get("min-css-ext");
    var dirPath = appPath + "/" + relPath;
    var minFile = dirPath + "/" + appName + "_" + this._CSS_CNT + minExt;
    fs.createDirs(dirPath, delegate(this, function(err, createdDir) {
      if (err) {
        callback(err);
      } else {
        this.createFile(fileContent, minFile, delegate(this, function(err, createdFile) {
          if (err) {
            callback(err);
          } else {
            if (createdFile === minFile) {
              this._CSS_CNT++;
            }
            callback(null, createdFile);
          }
        }));
      }
    }));
  };

  Config.prototype.toString = function() {
    return "Config";
  };

  module["exports"] = Config;
})(this);
