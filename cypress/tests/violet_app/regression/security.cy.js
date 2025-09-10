import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Security Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("should not execute script when submitted into input fields", () => {
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
