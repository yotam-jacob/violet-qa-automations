const { defineConfig } = require("cypress");
const {
  install: installHarPlugin,
  ensureBrowserFlags,
} = require("@neuralegion/cypress-har-generator");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  pageLoadTimeout: 25000,
  video: true,
  videoCompression: false,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",

  env: {
    hars_folders: "log/network",
  },

  e2e: {
    baseUrl: "https://dev.violetgrowth.com",
    specPattern: "cypress/tests/**/*.cy.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,

    setupNodeEvents(on, config) {
      installHarPlugin(on, config);

      on("before:browser:launch", (browser = {}, launchOptions) => {
        ensureBrowserFlags(browser, launchOptions);
        return launchOptions;
      });

      on("task", {
        logToTerminal(msg) {
          console.log(msg);
          return null;
        },
      });
      return config;
    },
  },
});
