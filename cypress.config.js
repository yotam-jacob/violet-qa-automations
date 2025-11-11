const { defineConfig } = require("cypress");
const installLogsPrinter = require("cypress-terminal-report/src/installLogsPrinter");
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

  pageLoadTimeout: 120000,
  video: true,
  videoCompression: false,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",

  e2e: {
    baseUrl: "https://dev.violetgrowth.com",
    specPattern: "cypress/tests/**/*.cy.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,

    setupNodeEvents(on, config) {
      installLogsPrinter(on, {
        collectTestLogs: true,
        printLogsToConsole: "always",
        printLogsToFile: "always",
        outputRoot: "log",
        outputTarget: {
          "cypress-terminal-report/console.log": "txt",
        },
      });

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
