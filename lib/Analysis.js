(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error('Analysis.js can only be used within node.js'));
  }

  var fs = require('fs');

  var globalReportID = '__GLOBAL_REPORT';

  var formatMsg = function(msg, size) {
    size = size || 5;
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

  var tripleArrowMsg = function(topTitle, topMsg, botTitle, botMsg, midTitle, midMsg) {
    var width = (topTitle.length > botTitle.length ? topTitle.length : botTitle.length) + 1;
    topTitle = formatMsg(topTitle, width);
    botTitle = formatMsg(botTitle, width);
    var pad = '   ';
    var topArrow = pad + topTitle + ' >  ' + topMsg + '\n';
    var botArrow = pad + botTitle + ' >  ' + botMsg + '\n';
    var arrowWidth = topArrow.length > botArrow.length ? topArrow.length : botArrow.length;
    var str = '\n';
    str += pad + new Array(topTitle.length + 1).join('-') + '\\\n';
    str += topArrow;
    str += formatMsg(pad + new Array(topTitle.length + 1).join('-') + '/', arrowWidth);
    str += '  ' + new Array(midTitle.length + 1).join('-') + '\\\n';

    str += '  ' + new Array(topArrow.length).join(' ') + midTitle + ' >  ' + midMsg + '\n';

    str += formatMsg(pad + new Array(botTitle.length + 1).join('-') + '\\', arrowWidth);
    str += '  ' + new Array(midTitle.length + 1).join('-') + '/\n';
    str += botArrow;
    str += pad + new Array(botTitle.length + 1).join('-') + '/';
    str += '\n';
    return str;
  };

  var Analysis = function() {
    this.reportMap = {
    };
  };

  Analysis.prototype.addReport = function(fileArr, minFile, reportID) {
    reportID = reportID || globalReportID;
    var totalSize = 0;
    fileArr.forEach(function(filePath) {
      var fileCnt = fs.readFileSync(filePath);
      totalSize += fileCnt.length;
    });
    var totalMinSize = 0;
    minFile = Array.isArray(minFile) ? minFile : [minFile];
    minFile.forEach(function(filePath) {
      var fileCnt = fs.readFileSync(filePath);
      totalMinSize += fileCnt.length;
    });
    var reportArr = this.reportMap[reportID];
    if (!reportArr) {
      reportArr = [];
      this.reportMap[reportID] = reportArr;
    }
    reportArr.push({
      fileArr: fileArr,
      totalSize: totalSize,
      minFileArr: minFile,
      totalMinSize: totalMinSize
    });
  };

  Analysis.prototype.getReport = function(reportID) {
    reportID = reportID || globalReportID;
    var reportArr = this.reportMap[reportID];
    if (reportArr) {
      var totalSize = 0;
      var totalMinSize = 0;
      var reportData = '';
      reportArr.forEach(function(report) {
        var fileArr = report.fileArr;
        totalSize += report.totalSize;
        var minFileArr = report.minFileArr;
        totalMinSize += report.totalMinSize;
        reportData += '\n' + underlineMsg('File Set:');
        fileArr.unshift('');
        reportData += '\n' + fileArr.join('\n   ---> ');
        reportData += '\n';
        reportData += '\n' + underlineMsg('Shrunk To:');
        minFileArr.unshift('');
        reportData += '\n' + minFileArr.join('\n   ---> ');
        reportData += '\n';
        reportData += '\n';
      });
      var ratio = parseInt((totalMinSize / totalSize) * 100);
      reportData += '\n' + underlineMsg('Total Number Of Characters:');
      reportData += '\n';
      reportData += tripleArrowMsg(' BEFORE Shrink', totalSize, ' AFTER Shrink', totalMinSize, ' Ratio', ratio + '%');
      reportData += '\n';
      reportData += '\n';
      return {
        ratio: ratio,
        toString: function() {
          return reportData;
        }
      };
    }
  };

  Analysis.prototype.toString = function() {
    return 'Analysis';
  };

  module['exports'] = Analysis;
})(this);
