// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-real-events/support";
import "@neuralegion/cypress-har-generator/commands";

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("&")) {
    return false; 
  } else if (
    err.message.includes("NetworkError when attempting to fetch resource")
  ) {
    return false; 
  } else if (
    err.message.includes("Failed to execute 'writeText' on 'Clipboard'")
  ) {
    return false; 
  } else if (err.message.includes("showCustomViewAsync")) {
    return false; 
  } else if (err.message.includes("reading 'status'")) {
    return false; 
  } else if (err.message.includes('Request failed with status code 500')) {
    return false; 
  }

  return true;
});

require("cypress-xpath");

beforeEach(() => {
  cy.recordHar();
});

afterEach(() => {
  cy.saveHar();
});
