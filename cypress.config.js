const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/tests/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
