(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error('Analysis.js can only be used within node.js'));
  }

  var fs = require('fs');

  var globalReportID = '__GLOBAL_REPORT';

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

  var tripleArrowMsg = function(topTitle, topMsg, botTitle, botMsg, midTitle, midMsg) {
    var width = topMsg.length > botMsg.length ? topMsg.length : botMsg.length;
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
    this.fileMap = {
    };
  };

  Analysis.prototype.addReport = function(reportID, fileArr, minFile) {
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
    this.fileMap[reportID] = {
      fileArr: fileArr,
      totalSize: totalSize,
      minFileArr: minFile,
      totalMinSize: totalMinSize
    };
    var globalReport = this.getReport(globalReportID);
    if (!globalReport) {
      globalReport = {
        fileArr: [],
        totalSize: 0,
        minFileArr: [],
        totalMinSize: 0
      };
      this.fileMap[globalReportID] = globalReport;
    }
    globalReport.fileArr.push.apply(globalReport.fileArr, fileArr);
    globalReport.totalSize += totalSize;
    globalReport.minFileArr.push.apply(globalReport.minFileArr, minFile);
    globalReport.totalMinSize += totalMinSize;
  };

  Analysis.prototype.getReport = function(reportID) {
    var report = this.fileMap[reportID];
    if (report) {
      var fileArr = report.fileArr;
      var totalSize = report.totalSize;
      var minFileArr = report.minFileArr;
      var totalMinSize = report.totalMinSize;
      var ratio = parseInt((totalMinSize / totalSize) * 100);
      report.ratio = ratio;
      report.toString = function() {
        var reportData = '';
        reportData += '\n' + underlineMsg('Original Files:');
        fileArr.unshift('');
        reportData += '\n' + fileArr.join('\n   ---> ');
        reportData += '\n';
        reportData += '\n' + underlineMsg('Minified Files:');
        reportData += '\n';
        minFileArr.unshift('');
        reportData += '\n' + minFileArr.join('\n   ---> ');
        reportData += '\n';
        reportData += '\n';
        reportData += '\n' + underlineMsg('Total Number Of Characters:');
        reportData += '\n';
        reportData += tripleArrowMsg(' BEFORE Shrink', totalSize, ' AFTER Shrink', totalMinSize, ' Ratio', ratio + '%');
        reportData += '\n';
        return reportData;
      };
    }
    return report;
  };

  Analysis.prototype.getGlobalReport = function() {
    return this.getReport(globalReportID);
  };

  Analysis.prototype.toString = function() {
    return 'Analysis';
  };

  module['exports'] = Analysis;
})(this);
