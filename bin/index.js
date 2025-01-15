// index.js

requirejs(['app'], MyApp => {
  const app = new MyApp.App();
  Object.assign(window, { app, App: MyApp.App });
  app.start();
});
