import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Extras Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("User can create a public view", () => {
    //Create new public view
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

    cy.reload();
    cy.get("#__next", { timeout: 15000 }).should("exist");

    // Verify it is set as public

    cy.contains("Views", { timeout: 40000 }).click();

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains(AUTOMATION_VIEW_NAME).realHover();

    cy.contains("You are sharing this view as a Team view", {
      timeout: 40000,
    }).should("be.visible");

    //Change the view to non public
    cy.clickVisibleThreeDots();

    cy.get("#isPublic", { timeout: 40000 }).click();
    cy.contains("You are sharing this view as a Team view", {
      timeout: 40000,
    }).should("not.exist");

    cy.reload();

    //Verify the view is renamed
    cy.contains("Views", { timeout: 40000 }).click();

    //Delete the view
    cy.contains(AUTOMATION_VIEW_NAME).realHover();

    cy.clickVisibleThreeDots();
    cy.clickOnDeleteViewAndVerify();
  });

  it("tests save_view_modal_clicks_save event payload", () => {
    //Create new view
    cy.createView(AUTOMATION_VIEW_NAME);

    cy.validateGtmEvent(
      "save view modal clicks",
      gtmExpectedEvents.save_view_modal_clicks_save,
      consoleMessages
    );

    cy.reload();

    //Verify the view is renamed
    cy.contains("Views", { timeout: 10000 }).click();

    //Delete the view
    cy.contains(AUTOMATION_VIEW_NAME).realHover();

    cy.clickVisibleThreeDots();
    cy.clickOnDeleteViewAndVerify();
  });

  it("tests three_dots_default event payload", () => {
    //Create new view and set as default
    cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).should("be.visible");

    //Verify that the new view is set as default
    cy.reload();
    cy.get("#__next", { timeout: 15000 }).should("exist");

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();

    //Hover over the "Default" view and click the 3-dots menu
    cy.contains("Default").realHover();
    cy.clickVisibleThreeDots();

    //uncheck the default view
    cy.get("#isDefault", { timeout: 15000 }).click();

    cy.reload({ timeout: 15000 });
    cy.get("#__next", { timeout: 15000 }).should("exist");

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();
    cy.contains("Default").realHover();
    cy.clickVisibleThreeDots();
    //Delete the view
    cy.clickOnDeleteViewAndVerify();

    cy.validateGtmEvent(
      "3-dots view menu click",
      gtmExpectedEvents.three_dots_default,
      consoleMessages
    );
  });

  it("tests three_dots_public event payload", () => {
    cy.wait(3000);

    //Create new public view
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

    cy.reload();
    cy.get("#__next", { timeout: 15000 }).should("exist");

    // Verify it is set as public

    cy.contains("Views", { timeout: 10000 }).click();

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME)
      .find("div.group\\/item.relative")
      .realHover();

    cy.contains("You are sharing this view as a Team view").should(
      "be.visible"
    );

    //Change the view to non public
    cy.clickVisibleThreeDots();

    cy.get("#isPublic").click();
    cy.contains("You are sharing this view as a Team view").should("not.exist");

    // Delete the view
    cy.clickOnDeleteViewAndVerify();

    cy.validateGtmEvent(
      "3-dots view menu click",
      gtmExpectedEvents.three_dots_public,
      consoleMessages
    );
  });
});
