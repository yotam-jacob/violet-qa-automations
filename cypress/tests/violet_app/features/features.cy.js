import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Features Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("User has only 2 enabled view options using a non filtered view", () => {
    cy.contains("Views", { timeout: 40000 }).click();
    cy.contains("button", "Update View").should("be.disabled");
    cy.contains("button", "Save as New").should("be.enabled");
    cy.contains("button", "Reset").should("be.enabled");
  });

  it("Delete public view message confirmation test", () => {
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

    cy.reload();

    // Verify it is set as public
    cy.contains("Views", { timeout: 40000 }).click();

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, { timeout: 40000 })
      .find("div.group\\/item.relative")
      .realHover();

    cy.contains("You are sharing this view as a Team view", { timeout: 40000 })
      .contains(AUTOMATION_VIEW_NAME)
      .should("be.visible");

    //Change the view to non public
    cy.clickVisibleThreeDots();

    cy.contains("Delete view", { timeout: 40000 }).click();

    cy.contains(
      "Are you sure you want to delete “" +
        AUTOMATION_VIEW_NAME +
        "“ from your list of saved views?",
      { timeout: 40000 }
    ).should("be.visible");

    cy.contains("button", "Remove", { timeout: 45000 }).click();
    cy.wait(2000);
    cy.reload();
  });

  // it("User can use other users public view as its default view with consistency to reload, and return to previous state", () => {

  // });

  // it("User can alternate default between public view and private view", () => {

  // });

  //todo: add analytics for using other users public view as default view
});
