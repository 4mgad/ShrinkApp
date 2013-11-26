(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error('Analysis.js can only be used within node.js'));
  }

  var fs = require('fs');

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

  var tripleArrowMsg = function(topMsg, botMsg, arrowTitle) {
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

    var report = '';
    report += '\n' + underlineMsg('Original Files:');
    fileArr.unshift('');
    report += '\n' + fileArr.join('\n   ---> ');
    report += '\n';
    report += '\n' + underlineMsg('Minified Files:');
    report += '\n';
    report += '\n   ---> ' + minFile;
    report += '\n';
    report += '\n' + underlineMsg('Total Number Of Characters:');
    report += '\n';
    report += arrowMsg(totalSize, formatMsg(' BEFORE Shrink'));
    report += arrowMsg(minSize, formatMsg(' AFTER Shrink'));
    report += arrowMsg(ratio + '%', formatMsg(' Ratio'));

    this.fileMap[reportID] = {
      fileArr: fileArr,
      totalSize: 100,
      minFile: minFile,
      minSize: 50,
      ratio: ratio,
      toString: function() {
        return report;
      }
    };
  };

  Analysis.prototype.getReport = function(reportID) {
    return this.fileMap[reportID];
  };

  Analysis.prototype.getAll = function() {
    var allReports = '';
    var fileMap = this.fileMap;
    var reportKeys = Object.keys(this.fileMap);
    reportKeys.forEach(function(key) {
      allReports += fileMap[key].toString();
    });
  };

  Analysis.prototype.toString = function() {
    return 'Analysis';
  };

  module['exports'] = Analysis;
})(this);
