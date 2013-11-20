var TestSuite = {
  run: function(callback) {

    console.log('Testing Config.js');

    var Config = require("../lib/Config.js");

    var testCase5 = function() {
      console.log('Test Case #5');
      var c = new Config();
      c.config(__dirname + "/app/app.json", function(err) {
        if (err) {
          console.log(err);
        } else {
          if (c.get('app-name') === 'myApp'
            && c.get('output-path') === '../build'
            && c.getFilter('html').toString() === 'ParseHTML'
            && c.getFilter('css').toString() === 'ShrinkCSS'
            && c.getFilter('less').toString() === 'CompileLESS'
            && c.getFilter('LESS').toString() === 'CompileLESS'
            && c.getFilterName('less') === 'CompileLESS'
            && !c.getFilter('none')
            && c.filterDepth('less') === 1
            && c.filterDepth('css') === 2
            && c.filterDepth('none') === -1
            ) {
            console.log('SUCCESS!');
            callback();
          } else {
            console.log('FAILED');
          }
        }
      });
    };

    var testCase4 = function() {
      console.log('Test Case #4');
      var c = new Config();
      c.config({
        'force': true
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          c.createCSSFile("sample css text 1", function(err, cssFilePath1) {
            if (err) {
              console.log(err);
            } else {
              c.createCSSFile("sample css text 1", function(err, cssFilePath2, outputFile) {
                if (err) {
                  console.log(err);
                } else {
                  if (cssFilePath2 === c.getBuildDir() + '/css/app_0.min.css') {
                    c.finalize(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        if (outputFile === c.getOutputPath() + '/css/app_0.min.css') {
                          console.log('SUCCESS!');
                          testCase5();
                        } else {
                          console.log('FAILED');
                        }
                      }
                    });
                  } else {
                    console.log('FAILED');
                  }
                }
              });
            }
          });
        }
      });
    };

    var testCase3 = function() {
      console.log('Test Case #3');
      var c = new Config();
      c.config({
        'force': true
      },
      function(err) {
        if (err) {
          console.log(err);
        } else {
          c.createCSSFile("sample css text 1", function(err, cssFilePath, outputFile) {
            if (err) {
              console.log(err);
            } else {
              if (cssFilePath === c.getBuildDir() + '/css/app_0.min.css') {
                c.finalize(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (outputFile === c.getOutputPath() + '/css/app_0.min.css') {
                      console.log('SUCCESS!');
                      testCase4();
                    } else {
                      console.log('FAILED');
                    }
                  }
                });
              } else {
                console.log('FAILED');
              }
            }
          });
        }
      });
    };

    var testCase2 = function() {
      console.log('Test Case #2');
      var c = new Config();
      c.config({
        'force': true
      },
      function(err) {
        if (err) {
          console.log(err);
        } else {
          c.createJSFile("sample js text 1", function(err, jsFilePath1) {
            if (err) {
              console.log(err);
            } else {
              c.createJSFile("sample js text 1", function(err, jsFilePath2, outputFile) {
                if (err) {
                  console.log(err);
                } else {
                  if (jsFilePath2 === c.getBuildDir() + '/js/app_0.min.js') {
                    c.finalize(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        if (outputFile === c.getOutputPath() + '/js/app_0.min.js') {
                          console.log('SUCCESS!');
                          testCase3();
                        } else {
                          console.log('FAILED');
                        }
                      }
                    });
                  } else {
                    console.log('FAILED');
                  }
                }
              });
            }
          });
        }
      });
    };

    var testCase1 = function() {
      console.log('Test Case #1');
      var c = new Config();
      c.config({
        'force': true
      },
      function(err) {
        if (err) {
          console.log(err);
        } else {
          c.createJSFile("sample js text 1", function(err, buildFile, outputFile) {
            if (err) {
              console.log(err);
            } else {
              if (buildFile === c.getBuildDir() + '/js/app_0.min.js') {
                c.finalize(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (outputFile === c.getOutputPath() + '/js/app_0.min.js') {
                      console.log('SUCCESS!');
                      testCase2();
                    } else {
                      console.log('FAILED');
                    }
                  }
                });
              } else {
                console.log('FAILED');
              }
            }
          });
        }
      });
    }();

  }
};
module["exports"] = TestSuite;