import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Security Test Suite", () => {
  beforeEach(() => {
    cy.cdnVisit("/login?from=/");
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains("Sign in with email", { timeout: 45000 }).should("be.visible");
    cy.loginToVioletStg();
  });

  it("should not execute script when submitted into input fields", () => {
    cy.wait(3000);
    const maliciousScript = "<script>alert(1)</script>";
    cy.wait(3000);
    //Create new view
    cy.createView(maliciousScript);
    cy.wait(3000);

    cy.contains(maliciousScript).should("exist");
    cy.wait(3000);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.get("@alert").should("not.have.been.called");
    cy.wait(3000);

    cy.contains(maliciousScript, { timeout: 20000 }).click();

    cy.wait(3000);

    //Delete the view
    cy.contains("div.w-full", maliciousScript).realHover();
    cy.wait(3000);

    cy.clickVisibleThreeDots();
    cy.wait(3000);

    cy.clickOnDeleteViewAndVerify();
  });
});
