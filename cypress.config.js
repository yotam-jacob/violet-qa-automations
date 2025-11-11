// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  videosFolder: "cypress/videos",
  pageLoadTimeout: 30000,
  defaultCommandTimeout: 30000,
  e2e: {
    specPattern: "cypress/tests/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
  },
});
