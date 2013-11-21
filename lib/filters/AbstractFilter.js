(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("AbstractFilter.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var delegate = require("../Utils.js").delegate;

  var AbstractFilter = function() {
    this.processedFiles = [];
  };

  AbstractFilter.prototype.applyFilter = function(filePath, callback) {
    var fileArr = [];
    if (typeof filePath === 'string') {
      fileArr.push(filePath);
    } else if (Array.isArray(filePath)) {
      fileArr = filePath;
    }
    callback = callback || function() {
    };
    this.processFiles(fileArr, delegate(this, function(err, outputFiles) {
      if (err) {
        callback(err);
      } else {
        if (typeof outputFiles === 'string') {
          this.processedFiles.push.apply(this.processedFiles, fileArr);
          callback(null, [outputFiles]);
        } else if (Array.isArray(outputFiles)) {
          this.processedFiles.push.apply(this.processedFiles, fileArr);
          callback(null, outputFiles);
        } else {
          callback('Error processing files:\n\n' + fileArr);
        }
      }
    }));
  };

  AbstractFilter.prototype.processFiles = function(fileArr, callback) {
    //TO BE IMPLEMENTED BY INHERITING CLASSES
  };

  AbstractFilter.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    try {
      var processedFiles = this.processedFiles;
      for (var i = 0; i < processedFiles.length; i++) {
        if (fs.existsSync(processedFiles[i])) {
          fs.unlinkSync(processedFiles[i]);
        }
      }
      callback(null, processedFiles);
    } catch (err) {
      callback(err);
    }
  };

  AbstractFilter.prototype.toString = function() {
    return "AbstractFilter";
  };

  module["exports"] = AbstractFilter;
})(this);
