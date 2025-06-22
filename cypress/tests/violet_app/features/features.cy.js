import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";
import { AUTOMATION_PUBLIC_VIEW_NAME } from "/cypress/support/constants.js";

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

  // // needs fix: https://app.clickup.com/t/86c42c6c0
  // it("User can use other users public view as its default view with consistency to reload, and return to previous state", () => {
  //   // Open views menu
  //   cy.contains("Views", { timeout: 40000 }).click();

  //   // Selected the automation public view as default
  //   cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).realHover();
  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000); //necessary for elements loading

  //   cy.get("#isDefault", { timeout: 40000 }).click();
  //   cy.contains("Default", { timeout: 40000 }).should("be.visible");

  //   //reload
  //   cy.reload();

  //   // public automation view is still default
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.contains("Default", { timeout: 40000 }).should("be.visible");

  //   // uncheck it
  //   cy.contains("Default", { timeout: 40000 }).closest("div").realHover();
  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000); //necessary for elements loading
  //   cy.get("#isDefault", { timeout: 40000 }).click();
  //   cy.wait(3000); //necessary for elements loading
  //   // reload
  //   cy.reload();
  //   //unfiltered report is loaded
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   cy.contains("Views", { timeout: 60000 }).should("be.visible");
  // });

  // // needs fix: https://app.clickup.com/t/86c42c6c0
  // it("User can alternate default between public view and private view", () => {
  //   // Create a private default view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });
  //   // refresh the page
  //   cy.reload();
  //   // private default view is created properly
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   // open views menu
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   // Select the automation public view as default
  //   cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).realHover();
  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000); //necessary for elements loading
  //   cy.get("#isDefault", { timeout: 40000 }).click();
  //   // reload
  //   cy.reload();
  //   // public automation view is still default
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();
  //   // select the private view as default
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).realHover();
  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000); //necessary for elements loading
  //   cy.get("#isDefault", { timeout: 40000 }).click();
  //   // reload
  //   cy.reload();
  //   // private view is still default
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   // delete private view
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).realHover();
  //   cy.clickVisibleThreeDots();
  //   cy.clickOnDeleteViewAndVerify();
  //   // reload
  //   cy.reload();
  //   // unfiltered report is loaded
  //   cy.get("#__next", { timeout: 45000 }).should("exist");
  //   cy.contains("Views", { timeout: 60000 }).should("be.visible");
  // });
});
