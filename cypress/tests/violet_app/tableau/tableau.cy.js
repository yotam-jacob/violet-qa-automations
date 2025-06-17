import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Tableau Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("should log in successfully and redirect to the QA partners page", () => {
    cy.url().should("include", "/partners/qa");
    cy.contains("Kudoboard Reports", { timeout: 10000 }).click();
    cy.contains("Contribution Margin - Kudoboard", { timeout: 10000 }).click();

    cy.get("tableau-viz")
      .shadow()
      .find("iframe", { timeout: 10000 })
      .should("have.attr", "src")
      .and("include", "tableau.com")
      .and("not.be.empty");

    cy.get("tableau-viz")
      .shadow()
      .find("iframe", { timeout: 10000 })
      .invoke("attr", "title")
      .should(
        "contain",
        "Data Visualization: KB Fundamentals - Contribution Margin Tree: Contribution Margin"
      );
  });
});
