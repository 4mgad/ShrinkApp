(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("ParseHTML.js can only be used within node.js"));
  }

  var fs = require("extendfs");
  var path = require('path');
  var beautify_html = require('js-beautify').html;
  var Handler = require('htmlparser2').DomHandler;
  var Parser = require('htmlparser2').Parser;
  var DomUtils = require('htmlparser2').DomUtils;
  var Config = require("../Config.js");
  var delegate = require("../Utils.js").delegate;

  var ParseHTML = function(appConf) {
    this.appConf = appConf || new Config();
    this.filterArr = [];
  };

  ParseHTML.getInstance = function(appConf) {
    return new ParseHTML(appConf);
  };

  ParseHTML.prototype.applyFilter = function(filePath, callback) {
    this.currFilters = this.appConf.get('filters');
    var applyFilterCB = delegate(this, function(err, htmlArr) {
      if (err) {
        console.log(err);
      } else {
        if (this.currFilters['__next__']) {
          this.currFilters = this.currFilters['__next__'];
          this._applyFilter(htmlArr, applyFilterCB);
        } else {
          callback(err, htmlArr);
        }
      }
    });
    this._applyFilter(filePath, applyFilterCB);
  };

  ParseHTML.prototype._applyFilter = function(filePath, callback) {
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
    var check = function(decrement) {
      decrement && count--;
      if (count <= 0) {
        callback(null, htmlArr);
      }
    };
    check();
    fileArr.forEach(delegate(this, function(filePath) {
      if (fs.existsSync(filePath)) {
        try {
          var html = fs.readFileSync(filePath, 'utf8');
          var conf = this.appConf;
          var filterArr = this.filterArr;
          var filters = this.currFilters || {};
//              var filterMap = {
//                'ext': {
//                  filter: Object,
//                  elements: {
//                    'parent_tagname_#': {
//                      parent: Object,
//                      children: []
//                    }
//                  }
//                }
//              };
          var filterMap = {};
          var findByParent = function(ext, parent, cb) {
            var filter = filterMap[ext];
            if (filter) {
              for (var key in filter.elements) {
                var p = filter.elements[key];
                if (p.parent === parent) {
                  cb(null, p.children);
                  return;
                }
              }
            }
            cb("Couldn't find children array");
          };
          var childCnt = 0;
          var addChild = function(ext, child, cb) {
            var parent = child.parent;
            findByParent(ext, parent, function(err, children) {
              if (!children) {
                var filterName = filters[ext.toLowerCase()];
                if (filterName) {
                  var filter = filterMap[ext];
                  if (!filter) {
                    filter = {
                      filterObj: conf.getFilter(ext)
                    };
                    filterMap[ext] = filter;
                    filterArr.push(filter.filterObj);
                  }
                  filter.elements = filter.elements || {};
                  var cnt = 0;
                  while (filter.elements[parent.name + '_' + cnt]) {
                    cnt++;
                  }
                  var parentID = parent.name + '_' + cnt;
                  filter.elements[parentID] = {
                    parent: parent,
                    children: []
                  };
                  children = filter.elements[parentID].children;
                } else {
                  //cb('No filter found for ' + ext);
                  return;
                }
              }
              children.push(child);
              childCnt++;
              cb();
            });
          };
          var writeHtml = function(dom, toFile) {
            var htmlOut = '';
            dom.forEach(function(el) {
              htmlOut += DomUtils.getOuterHTML(el);
            });
            try {
              fs.writeFileSync(toFile, beautify_html(htmlOut, conf.get('js-beautify-conf')));
              htmlArr.push(toFile);
              check(true);
            } catch (err) {
              callback(err);
            }
          };
          var handler = new Handler(delegate(this, function(err, dom) {
            if (err) {
              callback(err);
            } else {
              //process filterMap
              var currPath = path.dirname(filePath) + "/";
              //write html file after applying all filters
              var checkCnt = function(decrement) {
                decrement && childCnt--;
                if (childCnt <= 0) {
                  writeHtml(dom, filePath);
                }
              };
              checkCnt();
              //for each extension
              for (var ext in filterMap) {
                var f = filterMap[ext];
                //for each parent tag
                for (var tagID in f.elements) {
                  var element = f.elements[tagID];
                  var elArr = element.children;
                  //collect resource links
                  var resourceArr = [];
                  for (var i = 0; i < elArr.length; i++) {
                    var el = elArr[i];
                    resourceArr.push(currPath + (el.attribs.href || el.attribs.src));
                  }
                  //apply corresponding filter
                  f.filterObj.applyFilter(resourceArr, (function(_elArr) {
                    return function(err, resultArr) {
                      if (err) {
                        callback(err);
                      } else {
                        for (var i = 0; i < _elArr.length; i++) {
                          var el = _elArr[i];
                          if (resultArr[i]) {
                            if (el.attribs.src) {
                              el.attribs.src = resultArr[i].substring(currPath.length);
                            }
                            if (el.attribs.href) {
                              el.attribs.href = resultArr[i].substring(currPath.length);
                            }
                          } else {
                            DomUtils.removeElement(el);
                          }
                          checkCnt(true);
                        }
                      }
                    };
                  })(elArr.slice()));
                }
              }
            }
          }), delegate(this, function(el) {
            if (el.name === 'link' || el.name === 'script') {
              if (el.name === 'link' && el.attribs.rel !== 'stylesheet') {
                el.attribs.rel = 'stylesheet';
              }
              var filePath = el.attribs.href || el.attribs.src;
              var removeArr = this.appConf.get("remove");
              if (removeArr.indexOf(filePath) > -1) {
                DomUtils.removeElement(el);
              } else {
                var minCSSExt = this.appConf.get("min-css-ext");
                var minCSSExtRE = new RegExp(minCSSExt.replace(/\./g, '\.') + '$', 'gi');
                var minJSExt = this.appConf.get("min-js-ext");
                var minJSExtRE = new RegExp(minJSExt.replace(/\./g, '\.') + '$', 'gi');
                if (filePath && !filePath.match(minCSSExtRE) && !filePath.match(minJSExtRE)) {
                  addChild(fs.getExtension(filePath), el, function(err) {
                    if (err) {
                      callback(err);
                    }
                  });
                }
              }
            }
          }));
          var parser = new Parser(handler);
          parser.parseComplete(html);
        } catch (err) {
          callback(err);
        }

      } else {
        callback(filePath + " does not exist");
      }
    }));
  };

  ParseHTML.prototype.finalize = function(callback) {
    callback = callback || function() {
    };
    var filterArr = this.filterArr;
    var fileArr = [];
    for (var i = 0; i < filterArr.length; i++) {
      filterArr[i].finalize(function(err, fArr) {
        if (err) {
          callback(err);
        } else {
          fileArr.push.apply(fileArr, fArr);
          if (i === (filterArr.length - 1)) {
            callback(null, fileArr);
          }
        }
      });
    }
  };

  ParseHTML.prototype.toString = function() {
    return "ParseHTML";
  };

  module["exports"] = ParseHTML;
})(this);
