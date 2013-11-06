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
  var delegate = require("../Utils.js").delegate;

  var ParseHTML = function(appConf) {
    this.appConf = appConf;
    this.filterArr = [];
  };

  ParseHTML.getInstance = function(appConf) {
    return new ParseHTML(appConf);
  };

  ParseHTML.prototype.applyFilter = function(filePath, callback) {
    var appConf = this.appConf;
    appConf.applyFilters = appConf['filter-chain'];
    var applyFilterCB = delegate(this, function(err, htmlArr) {
      if (err) {
        console.log(err);
      } else {
        if (appConf.applyFilters['__next__']) {
          appConf.applyFilters = appConf.applyFilters['__next__'];
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
      fs.exists(filePath, delegate(this, function(exists) {
        if (exists) {
          fs.readFile(filePath, 'utf8', delegate(this, function(err, html) {
            if (err) {
              callback(err);
            } else {
              var conf = this.appConf;
              var filterArr = this.filterArr;
              var filters = conf.applyFilters || {};
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
                          filter: require('./' + filterName + ".js").getInstance(conf),
                          elements: {}
                        };
                        filterMap[ext] = filter;
                        filterArr.push(filter.filter);
                      }
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
                fs.writeFile(toFile, beautify_html(htmlOut, conf['js-beautify-conf']), function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    htmlArr.push(toFile);
                    check(true);
                  }
                });
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
                      f.filter.applyFilter(resourceArr, (function(_elArr) {
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
                  var filePath = el.attribs.href || el.attribs.src;
                  var removeArr = this.appConf["remove"];
                  if (removeArr.indexOf(filePath) > -1) {
                    DomUtils.removeElement(el);
                  } else {
                    var minCSSExt = this.appConf["min-css-ext"];
                    var minCSSExtRE = new RegExp(minCSSExt.replace(/\./g, '\.') + '$', 'gi');
                    var minJSExt = this.appConf["min-js-ext"];
                    var minJSExtRE = new RegExp(minJSExt.replace(/\./g, '\.') + '$', 'gi');
                    if (!filePath.match(minCSSExtRE) && !filePath.match(minJSExtRE)) {
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
            }
          }));
        } else {
          callback(filePath + " does not exist");
        }
      }));

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

  module["exports"] = ParseHTML;
})(this);
