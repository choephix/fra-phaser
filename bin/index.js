// main.js
  
requirejs(['app'], function(MyApp) {
  console.log('starting application...');
  var app = new MyApp.App();
  app.start();
});