import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Features Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("User has only 2 enabled view options using a non filtered view", () => {
    cy.contains("Views", { timeout: 40000 }).click();
    cy.contains('button', 'Update View').should('be.disabled');
    cy.contains('button', 'Save as New').should('be.enabled');
    cy.contains('button', 'Reset').should('be.enabled');
  });
});