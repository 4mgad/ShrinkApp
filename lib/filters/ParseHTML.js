(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ParseHTML.js can only be used within node.js"));
  }

  var fs = require('fs');
  var path = require('path');
  var beautify_html = require('js-beautify').html;
  var Handler = require('htmlparser2').DomHandler;
  var Parser = require('htmlparser2').Parser;
  var DomUtils = require('htmlparser2').DomUtils;
  var delegate = require("../Utils.js").delegate;

  var CompileLESS = require("./CompileLESS.js");
  var ShrinkCSS = require("./ShrinkCSS.js");
  var ShrinkJS = require("./ShrinkJS.js");

  var ParseHTML = function(appConf) {
    this.appConf = appConf;
  };

  ParseHTML.getInstance = function(appConf) {
    return new ParseHTML(appConf);
  };

  ParseHTML.prototype.applyFilter = function(filePath, callback) {
    var fileArr = [];
    if (typeof filePath === 'string') {
      fileArr.push(filePath);
    } else if (Array.isArray(filePath)) {
      fileArr = filePath;
    }
    callback = callback || function() {
    };

    var htmlArr = [];
    var count = fileArr.length;
    var check = delegate(this, function(decrement) {
      if (decrement) {
        count--;
      }
      if (count <= 0) {
        callback(null, htmlArr);
      }
    });
    check();
    fileArr.forEach(delegate(this, function(filePath) {

      fs.exists(filePath, delegate(this, function(exists) {
        if (exists) {
          fs.readFile(filePath, 'utf8', delegate(this, function(err, html) {
            if (err) {
              callback(err);
            } else {
              var lessArr = [];
              var cssArr = [];
              var scriptArr = [];
              var handler = new Handler(delegate(this, function(err, dom) {
                if (err) {
                  callback(err);
                } else {
                  var compileLESS = CompileLESS.getInstance(this.appConf);
                  var lessMap = {};
                  var lessFiles = [];
                  for (var i = 0; i < lessArr.length; i++) {
                    var el = lessArr[i];
                    var href = el.attribs.href;
                    var lessPath = path.dirname(filePath) + "/" + href;
                    lessMap[lessPath] = el;
                    lessFiles.push(lessPath);
                  }
                  compileLESS.applyFilter(lessFiles, function(err, cssArr, lessArr) {
                    console.log(lessMap[lessArr[0]].attribs.href);
                  });
                  /*
                   this.processLessArr(filePath, lessArr, dom, delegate(this, function(err, lessCssArr) {
                   if (err) {
                   callback(err);
                   } else {
                   cssArr = cssArr.concat(lessCssArr);
                   this.processCssArr(filePath, cssArr, dom, delegate(this, function(err) {
                   if (err) {
                   callback(err);
                   } else {
                   this.processScriptArr(filePath, scriptArr, dom, delegate(this, function(err) {
                   if (err) {
                   callback(err);
                   } else {
                   var htmlOut = '';
                   dom.forEach(function(el) {
                   htmlOut += DomUtils.getOuterHTML(el);
                   });
                   fs.writeFile(filePath, beautify_html(htmlOut, this.appConf['js-beautify-conf']), function(err) {
                   if (err) {
                   callback(err);
                   }
                   });
                   }
                   }));
                   }
                   }));
                   }
                   }));
                   */
                }
              }), delegate(this, function(el) {
                if (el.name === 'link') {
                  var href = el.attribs.href;
                  if (href && href.match('\.less$', 'gi')) {
                    lessArr.push(el);
                  }
                  if (href && href.match('\.css', 'gi')) {
                    if (!href.match('\.min\.css', 'gi')) {
                      cssArr.push(el);
                    }
                  }
                }
                if (el.name === 'script') {
                  var src = el.attribs.src;
                  if (src && !src.match('\.min\.js$', 'gi')) {
                    scriptArr.push(el);
                  }
                }
              }));
              var parser = new Parser(handler);
              parser.parseComplete(html);
            }
          }));
        } else {
          callback(filePath + " does not exist");
        }
      }));

    }));

  };

  ParseHTML.prototype.finalize = function() {
    console.log("ParseHTML.finalize");
  };

  module["exports"] = ParseHTML;
})(this);
