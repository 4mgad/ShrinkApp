require('./1-test-Config.js').run(function() {
  require('./2-test-Utils.js').run(function() {
    require('./3-test-CompileLESS.js').run(function() {
      require('./4-test-ShrinkCSS.js').run(function() {
        require('./5-test-ShrinkJS.js').run(function() {
          require('./6-test-ParseHTML.js').run(function() {
            require('./7-test-ShrinkApp.js').run(function() {
              console.log("ALL TEST SUITES SUCCEEEDED!");
            });
          });
        });
      });
    });
  });
});
