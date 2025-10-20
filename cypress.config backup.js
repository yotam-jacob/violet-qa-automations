const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  videoCompression: false,

  e2e: {
    baseUrl: "https://dev.violetgrowth.com",
    specPattern: "cypress/tests/violet_app/**/*.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,
    videoCompression: false,
    pageLoadTimeout: 240000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on("task", {
        logToTerminal(msg) {
          console.log(msg);
          return null;
        },
      });

      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-gpu");
          launchOptions.args.push("--disable-dev-shm-usage");
          launchOptions.args.push(
            '--js-flags="--max_old_space_size=1024 --max_semi_space_size=1024"'
          );
        }
        return launchOptions;
      });
    },
  },
});
