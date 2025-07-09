const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  pageLoadTimeout: 160000,
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  videoCompression: false,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,

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
    specPattern: "cypress/tests/violet_app/**/*.js",
    viewportWidth: 1920,
    screenshotOnRunFailure: false,
    viewportHeight: 1080,
    experimentalMemoryManagement: true,
    videoCompression: false,
    numTestsKeptInMemory: 0,
  },
});
