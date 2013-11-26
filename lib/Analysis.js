(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Analysis.js can only be used within node.js"));
  }

  var fs = require("fs");

  var colWidth = 15;
  var formatMsg = function(msg, size) {
    size = size || colWidth;
    var formattedMsg = new Array(size);
    formattedMsg = formattedMsg.join(' ');
    formattedMsg = msg + formattedMsg.substr(msg.length);
    return formattedMsg;
  };

  var underlineMsg = function(msg) {
    var formattedMsg = new Array(msg.length + 1);
    formattedMsg = formattedMsg.join('=');
    formattedMsg = msg + '\n' + formattedMsg;
    return formattedMsg;
  };

  var arrowMsg = function(msg, arrowTitle) {
    arrowTitle = arrowTitle || '   ';
    var str = '\n';
    str += '   ' + new Array(arrowTitle.length + 1).join('-') + '\\\n';
    str += '   ' + arrowTitle + ' >  ' + msg + '\n';
    str += '   ' + new Array(arrowTitle.length + 1).join('-') + '/\n';
    return str;
  };

  var Analysis = function() {
    this.fileMap = {
    };
  };

  Analysis.prototype.addReport = function(reportID, fileArr, minFile) {

    var totalSize = 0;
    fileArr.forEach(function(filePath) {
      var fileCnt = fs.readFileSync(filePath);
      totalSize += fileCnt.length;
    });

    var minSize = fs.readFileSync(minFile).length;

    var ratio = parseInt((minSize / totalSize) * 100);

    var report = "";
    report += "\n" + underlineMsg("Original Files:");
    fileArr.unshift('');
    report += "\n" + fileArr.join('\n   ---> ');
    report += "\n" + arrowMsg(totalSize, formatMsg('Total Size'));
    report += "\n" + underlineMsg("Minified Files:");
    report += "\n   ---> " + minFile;
    report += "\n" + arrowMsg(minSize, formatMsg('Total Size'));
    report += "\n" + underlineMsg("Compare Sizes:");
    report += arrowMsg(ratio + '%', formatMsg('Ratio'));

    this.fileMap[reportID] = {
      fileArr: fileArr,
      totalSize: 100,
      minFile: minFile,
      minSize: 50,
      ratio: ratio,
      print: function() {
        console.log(report);
      }
    };
  };

  Analysis.prototype.getReport = function(reportID) {
    return this.fileMap[reportID];
  };

  Analysis.prototype.printAll = function() {
    var fileMap = this.fileMap;
    var reportKeys = Object.keys(this.fileMap);
    reportKeys.forEach(function(key) {
      fileMap[key].print();
    });
  };

  Analysis.prototype.toString = function() {
    return "Analysis";
  };

  module["exports"] = Analysis;
})(this);
