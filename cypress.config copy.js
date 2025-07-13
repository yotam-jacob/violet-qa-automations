const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  pageLoadTimeout: 240000, // increase to 4 minutes
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

      // Inject Chrome flags to avoid crashes in CI
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.name === "chrome" || browser.name === "chromium") {
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-gpu");
          launchOptions.args.push("--disable-dev-shm-usage");
        }
        return launchOptions;
      });
    },

    baseUrl: "https://dev.violetgrowth.com",
    specPattern: "cypress/tests/violet_app/**/*.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,
    videoCompression: false,
    pageLoadTimeout: 240000,
  },
});
