import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Security Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("should not execute script when submitted into input fields", () => {
    const maliciousScript = "<script>alert(1)</script>";
    cy.wait(1000);
    //Create new view
    cy.createView(maliciousScript);
    cy.wait(1000);

    cy.contains(maliciousScript).should("exist");
    cy.wait(1000);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.get("@alert").should("not.have.been.called");
    cy.wait(1000);

    cy.contains(maliciousScript, { timeout: 20000 }).click();

    cy.wait(1000);

    //Delete the view
    cy.contains("div.w-full", maliciousScript).realHover();
    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    cy.clickOnDeleteViewAndVerify();
  });
});
