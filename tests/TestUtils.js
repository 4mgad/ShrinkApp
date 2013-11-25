(function(global) {
  if ((typeof window !== 'undefined' && !!window.window) || typeof require !== 'function') {
    throw(new Error("TestUtils.js can only be used within node.js"));
  }

  var TestUtils = (function() {

    return {
      normalizeHTML: function(html, appName) {
        return html.replace(new RegExp(appName + '_[0-9]+', 'g'), appName + '_##');
      },
      formatMsg: function(msg, size) {
        var formattedMsg = new Array(size);
        formattedMsg = formattedMsg.join(' ');
        formattedMsg = msg + formattedMsg.substr(msg.length);
        return formattedMsg;
      }
    };
  })();

  module["exports"] = TestUtils;
})(this);
