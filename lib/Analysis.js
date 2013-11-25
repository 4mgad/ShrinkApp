(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("Analysis.js can only be used within node.js"));
  }

  var Analysis = function() {
    this.fileMap = {
      
    };
  };

  Analysis.prototype.toString = function() {
    return "Analysis";
  };

  module["exports"] = Analysis;
})(this);
