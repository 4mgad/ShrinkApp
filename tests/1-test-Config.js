var TestSuite = require("./TestSuite.js");

var Config = require("../lib/Config.js");

var configTS = new TestSuite("Config.js", [
  //0
  function(callback) {
    var c = new Config();
    c.config({
      'force': true
    },
    function(err) {
      if (err) {
        callback(err);
      } else {
        c.createJSFile("sample js text 1", function(err, buildFile, outputFile) {
          if (err) {
            callback(err);
          } else {
            if (buildFile === c.getBuildDir() + '/js/app_0.min.js') {
              c.finalize(function(err) {
                if (err) {
                  callback(err);
                } else {
                  if (outputFile === c.getOutputPath() + '/js/app_0.min.js') {
                    callback();
                  } else {
                    callback('FAILED');
                  }
                }
              });
            } else {
              callback('FAILED');
            }
          }
        });
      }
    });
  },
  //2
  function(callback) {
    var c = new Config();
    c.config({
      'force': true
    },
    function(err) {
      if (err) {
        callback(err);
      } else {
        c.createJSFile("sample js text 1", function(err, jsFilePath1) {
          if (err) {
            callback(err);
          } else {
            c.createJSFile("sample js text 1", function(err, jsFilePath2, outputFile) {
              if (err) {
                callback(err);
              } else {
                if (jsFilePath2 === c.getBuildDir() + '/js/app_0.min.js') {
                  c.finalize(function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (outputFile === c.getOutputPath() + '/js/app_0.min.js') {
                        callback();
                      } else {
                        callback('FAILED');
                      }
                    }
                  });
                } else {
                  callback('FAILED');
                }
              }
            });
          }
        });
      }
    });
  },
  //3
  function(callback) {
    var c = new Config();
    c.config({
      'force': true
    },
    function(err) {
      if (err) {
        callback(err);
      } else {
        c.createCSSFile("sample css text 1", function(err, cssFilePath, outputFile) {
          if (err) {
            callback(err);
          } else {
            if (cssFilePath === c.getBuildDir() + '/css/app_0.min.css') {
              c.finalize(function(err) {
                if (err) {
                  callback(err);
                } else {
                  if (outputFile === c.getOutputPath() + '/css/app_0.min.css') {
                    callback();
                  } else {
                    callback('FAILED');
                  }
                }
              });
            } else {
              callback('FAILED');
            }
          }
        });
      }
    });
  },
  //4
  function(callback) {
    var c = new Config();
    c.config({
      'force': true
    },
    function(err) {
      if (err) {
        callback(err);
      } else {
        c.createCSSFile("sample css text 1", function(err, cssFilePath1) {
          if (err) {
            callback(err);
          } else {
            c.createCSSFile("sample css text 1", function(err, cssFilePath2, outputFile) {
              if (err) {
                callback(err);
              } else {
                if (cssFilePath2 === c.getBuildDir() + '/css/app_0.min.css') {
                  c.finalize(function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (outputFile === c.getOutputPath() + '/css/app_0.min.css') {
                        callback();
                      } else {
                        callback('FAILED');
                      }
                    }
                  });
                } else {
                  callback('FAILED');
                }
              }
            });
          }
        });
      }
    });
  },
  //5
  function(callback) {
    var c = new Config();
    c.config(__dirname + "/app/app_1.json", function(err) {
      if (err) {
        callback(err);
      } else {
        if (c.get('app-name') === 'myApp'
          && c.get('output-path') === 'build'
          && c.getFilter('html').toString() === 'ParseHTML'
          && c.getFilter('css').toString() === 'ShrinkCSS'
          && c.getFilter('less').toString() === 'CompileLESS'
          && c.getFilter('LESS').toString() === 'CompileLESS'
          && c.getFilterName('less') === 'CompileLESS'
          && !c.getFilter('none')
          && c.filterDepth('less') === 1
          && c.filterDepth('css') === 2
          && c.filterDepth('none') === -1
          && c.getOutputPath(c.getBuildDir() + '/test/test.html') === (c.getOutputPath() + '/test/test.html')
          ) {
          callback();
        } else {
          callback('FAILED');
        }
      }
    });
  }
  
]);

module["exports"] = configTS;
