import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";
import { AUTOMATION_PUBLIC_VIEW_NAME } from "/cypress/support/constants.js";

describe("Features Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  // it("User has only 2 enabled view options using a non filtered view", () => {
  //   cy.contains("Views", { timeout: 40000 }).click();
  //   cy.contains("button", "Update View").should("be.disabled");
  //   cy.contains("button", "Save as New").should("be.enabled");
  //   cy.contains("button", "Reset").should("be.enabled");
  // });

  // it("Delete public view message confirmation test", () => {
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

  //   cy.reload();

  //   // Verify it is set as public
  //   cy.contains("Views", { timeout: 40000 }).click();

  //   //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, { timeout: 40000 })
  //     .find("div.group\\/item.relative")
  //     .realHover();

  //   cy.contains("You are sharing this view as a Team view", { timeout: 40000 })
  //     .contains(AUTOMATION_VIEW_NAME)
  //     .should("be.visible");

  //   //Change the view to non public
  //   cy.clickVisibleThreeDots();

  //   cy.contains("Delete view", { timeout: 40000 }).click();

  //   cy.contains(
  //     "Are you sure you want to delete “" +
  //       AUTOMATION_VIEW_NAME +
  //       "“ from your list of saved views?",
  //     { timeout: 40000 }
  //   ).should("be.visible");

  //   cy.contains("button", "Remove", { timeout: 45000 }).click();
  //   cy.wait(2000);
  //   cy.reload();
  // });

  //todo: check this test
  it("User can use other users public view as its default view with consistency to reload, and return to previous state", () => {
    // cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true, isDefault: true });

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

    cy.get("*", { timeout: 40000 })
      .filter(
        (_, el) =>
          el.textContent.includes(AUTOMATION_VIEW_NAME) &&
          el.textContent.includes("Default")
      )
      .should("have.length.at.least", 1)
      .first()
      .should("be.visible");

    cy.wait(3000);

    // Selected the automation public view as default
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).realHover();
    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    cy.get("#isDefault", { timeout: 40000 }).click();
    cy.get("*", { timeout: 40000 })
      .filter(
        (_, el) =>
          el.textContent.includes(AUTOMATION_PUBLIC_VIEW_NAME) &&
          el.textContent.includes("Default")
      )
      .should("have.length.at.least", 1)
      .first()
      .should("be.visible");
    cy.wait(1000);

    //reload
    cy.get("button", { timeout: 40000 })
      .filter(':has(img[alt="Logo"])')
      .first()
      .click({ force: true });

    // public automation view is now default
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();

    // revert to private view
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 })
      .closest("div")
      .realHover();

    cy.clickVisibleThreeDots();
    cy.wait(1000); //necessary for elements loading
    cy.get("#isDefault", { timeout: 40000 }).click();
    cy.wait(3000); //necessary for elements loading
    // reload
    cy.get("button", { timeout: 40000 })
      .filter(':has(img[alt="Logo"])')
      .first()
      .click({ force: true });

    //unfiltered report is loaded
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 60000 }).click();

    // delete the view
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, { timeout: 40000 })
      .find("div.group\\/item.relative")
      .realHover();

    cy.clickVisibleThreeDots();
    cy.clickOnDeleteViewAndVerify();
  });
});
