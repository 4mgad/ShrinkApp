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
  var Utils = require("../Utils.js");

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
    var check = function(decrement) {
      if (decrement) {
        count--;
      }
      if (count <= 0) {
        callback(null, htmlArr);
      }
    };
    check();
    fileArr.forEach(Utils.delegate(this, function(filePath) {

      fs.exists(filePath, Utils.delegate(this, function(exists) {
        if (exists) {
          fs.readFile(filePath, 'utf8', Utils.delegate(this, function(err, html) {
            if (err) {
              callback(err);
            } else {
              var conf = this.appConf;
              var filters = conf.filters;
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
                      cb('No filter found for ' + ext);
                      return;
                    }
                  }
                  children.push(child);
                  cb();
                });
              };
              var handler = new Handler(Utils.delegate(this, function(err, dom) {
                if (err) {
                  callback(err);
                } else {
                  //process filterMap
                  var currPath = path.dirname(filePath) + "/";
                  for (var ext in filterMap) {
                    var f = filterMap[ext];
                    for (var tagID in f.elements) {
                      var element = f.elements[tagID];
                      var elArr = element.children;
                      var fileArr = [];
                      for (var i = 0; i < elArr.length; i++) {
                        var el = elArr[i];
                        fileArr.push(currPath + (el.attribs.href || el.attribs.src));
                      }
                      f.filter.applyFilter(fileArr, (function(_elArr) {
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
                            }
                            var htmlOut = '';
                            dom.forEach(function(el) {
                              htmlOut += DomUtils.getOuterHTML(el);
                            });
                            fs.writeFile(filePath, beautify_html(htmlOut, conf['js-beautify-conf']), function(err) {
                              if (err) {
                                callback(err);
                              } else {
                                htmlArr.push(filePath);
                                check(true);
                              }
                            });
                          }
                        };
                      })(elArr.slice()));
                    }
                  }
                }
              }), Utils.delegate(this, function(el) {
                if (el.name === 'link' || el.name === 'script') {
                  var filePath = el.attribs.href || el.attribs.src;
                  if (!filePath.match(/\.min\.js$/g)) {
                    addChild(Utils.getExtension(filePath), el, function(err) {
                      if (err) {
                        callback(err);
                      }
                    });
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
