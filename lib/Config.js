(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Config.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var path = require('path');
  var os = require('os');
  var crypto = require('crypto');
  var Analysis = require("./Analysis.js");
  var delegate = require("./Utils.js").delegate;
  var isAbsolute = require("./Utils.js").isAbsolute;

  var defaultAppConf = {
    "app-name": "app",
    "output-path": "../build",
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

  var init = function(appConf, callback) {
    var outputPath = appConf['output-path'];
    var tempDir = appConf['_temp-dir'] = os.tmpdir() + '/shrinkapp/' + appConf['app-name'];
    var buildDir = appConf['_build-dir'] = tempDir + '/build';
    var initTemp = function(cb) {
      if (fs.existsSync(tempDir)) {
        if (fs.existsSync(buildDir)) {
          fs.deleteDir(buildDir, function(err) {
            if (err) {
              cb(err);
            } else {
              cb();
            }
          });
        } else {
          cb();
        }
      } else {
        fs.createDirs(tempDir, function(err) {
          if (err) {
            cb(err);
          } else {
            cb();
          }
        });
      }
    };
    if (fs.existsSync(outputPath)) {
      if (appConf['force']) {
        fs.deleteDir(outputPath, function(err) {
          if (err) {
            callback(err);
          } else {
            initTemp(callback);
          }
        });
      } else {
        callback(outputPath + ' already exists. To overwrite use:\n\nshrinkapp -f');
      }
    } else {
      initTemp(callback);
    }
  };

  var Config = function() {
  };

  Config.prototype.config = function(appConfPath, callback) {
    callback = callback || function() {
    };
    //clone default configuration
    this.appConf = JSON.parse(JSON.stringify(defaultAppConf));
    var conf = {};
    if (typeof appConfPath === 'function') {
      callback = appConfPath;
    } else if (typeof appConfPath === 'string') {
      if (fs.existsSync(appConfPath)) {
        conf = JSON.parse(fs.readFileSync(appConfPath, 'utf8'));
      }
    } else if (typeof appConfPath === 'object') {
      conf = appConfPath;
    }
    try {
      Object.keys(conf);
    } catch (e) {
      conf = {};
    }
    for (var key in conf) {
      this.appConf[key] = conf[key];
    }
    var dirPath = this.appConf['dir-path'];
    var outputPath = this.appConf['output-path'];
    if (!isAbsolute(outputPath)) {
      this.appConf['output-path'] = path.normalize(dirPath + '/' + outputPath);
    }
    init(this.appConf, callback);
  };

  Config.prototype.getAnalysis = function() {
    if (!this.analysis) {
      this.analysis = new Analysis(this);
    }
    return this.analysis;
  };

  Config.prototype.get = function(conf) {
    if (typeof conf === 'string') {
      //always return a clone
      return JSON.parse(JSON.stringify(this.appConf[conf]));
    }
  };

  Config.prototype.getTempDir = function() {
    return this.get('_temp-dir');
  };

  Config.prototype.getBuildDir = function() {
    return this.get('_build-dir');
  };

  Config.prototype.getOutputPath = function(filePath) {
    var outputPath = this.get('output-path');
    var buildDir = this.getBuildDir();
    if (filePath && filePath.length >= buildDir.length && filePath.substr(0, buildDir.length) === buildDir) {
      var outputFile = outputPath + filePath.substr(buildDir.length);
      return outputFile;
    }
    return outputPath;
  };

  Config.prototype.force = function() {
    return this.get('force');
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
      callback(null, currFile, false);
    } else {
      try {
        fs.writeFileSync(filePath, fileContent);
        this.hashMap[hash] = filePath;
        callback(null, filePath, true);
      } catch (err) {
        callback(err);
      }
    }
  };

  Config.prototype.createFileByType = function(fileContent, fileType, callback) {
    callback = callback || function() {
    };
    var up = fileType.toUpperCase();
    var low = fileType.toLowerCase();
    this['_' + up + '_CNT'] = this['_' + up + '_CNT'] || 0;
    var appName = this.get("app-name");
    var relPath = this.get(low + "-rel-path");
    var minExt = this.get("min-" + low + "-ext");
    var dirPath = this.getBuildDir() + "/" + relPath;
    var filePath = dirPath + "/" + appName + "_" + this['_' + up + '_CNT'] + minExt;
    fs.createDirs(dirPath, delegate(this, function(err, createdDir) {
      if (err) {
        callback(err);
      } else {
        this.createFile(fileContent, filePath, delegate(this, function(err, createdFile, newFile) {
          if (err) {
            callback(err);
          } else {
            if (createdFile === filePath) {
              this._JS_CNT++;
            }
            callback(null, createdFile, this.getOutputPath(createdFile), newFile);
          }
        }));
      }
    }));
  };

  Config.prototype.createJSFile = function(fileContent, callback) {
    this.createFileByType(fileContent, 'js', callback);
  };

  Config.prototype.createCSSFile = function(fileContent, callback) {
    this.createFileByType(fileContent, 'css', callback);
  };

  Config.prototype.finalize = function(callback) {
    var outputPath = this.get('output-path');
    var buildDir = this.get('_build-dir');
    try {
      fs.renameSync(buildDir, outputPath);
      callback();
    } catch (err) {
      callback(err);
    }
  };

  Config.prototype.toString = function() {
    return "Config";
  };

  module["exports"] = Config;
})(this);
