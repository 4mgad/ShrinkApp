(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error('Analysis.js can only be used within node.js'));
  }

  var fs = require('fs');
  var underlineMsg = require("./Utils.js").underlineMsg;
  var tripleArrowMsg = require("./Utils.js").tripleArrowMsg;

  var globalReportID = '__GLOBAL_REPORT';

  var Analysis = function(appConf) {
    this.appConf = appConf;
    this.reportMap = {
    };
  };

  Analysis.prototype.addReport = function(fileArr, minFile, reportID) {
    reportID = reportID || globalReportID;
    var appConf = this.appConf;
    var totalSize = 0;
    fileArr = fileArr.slice(0);
    fileArr.forEach(function(filePath, idx) {
      var fileCnt = fs.readFileSync(filePath);
      totalSize += fileCnt.length;
      fileArr[idx] = appConf.getOutputPath(filePath);
    });
    var totalMinSize = 0;
    minFile = Array.isArray(minFile) ? minFile.slice(0) : [minFile];
    minFile.forEach(function(filePath, idx) {
      var fileCnt = fs.readFileSync(filePath);
      totalMinSize += fileCnt.length;
      minFile[idx] = appConf.getOutputPath(filePath);
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
      reportData += '\n' + underlineMsg('Analysis (Total Number Of Characters):');
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
