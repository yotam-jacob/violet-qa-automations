import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Errors Handling Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("shows 404 page when navigating to a non-existent route", () => {
    // Visit a non-existent page
    cy.visit("https://dev.violetgrowth.com/unknownpage", {
      failOnStatusCode: false,
    });

    // Assert that the 404 page appears
    cy.contains(/Page Not Found/i).should("be.visible");
    cy.url().should("include", "/page-not-found");

    cy.contains("Violet Homepage").should("be.visible").click();
    cy.url().should("contain", "https://dev.violetgrowth.com/");
    cy.get("#__next").should("be.visible");
  });
});
