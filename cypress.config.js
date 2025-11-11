const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  videosFolder: 'cypress/videos',
  pageLoadTimeout: 45000,
  defaultCommandTimeout: 45000,
  e2e: {
    specPattern: 'cypress/tests/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
  },
});
