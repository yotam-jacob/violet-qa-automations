const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  pageLoadTimeout: 120000,
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  videoCompression: false,

  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        logToTerminal(msg) {
          console.log(msg);
          return null;
        },
      });
    },
    baseUrl: "https://dev.violetgrowth.com",
    specPattern: "cypress/tests/**/**/*.js",
    viewportWidth: 1920,
    screenshotOnRunFailure: false,
    viewportHeight: 1080,
  },
});
