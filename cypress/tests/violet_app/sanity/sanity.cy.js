import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Sanity Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("should log in successfully and redirect to the QA partners page", () => {
    cy.url().should("include", "/partners/qa");
  });

  it("should navigate to Appointments Tracker via SOL Reports menu", () => {
    cy.contains("h4", "SOL Reports").click({ force: true });

    cy.contains("Appointments Tracker", { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.url().should("include", "/reports/appointments-tracker");
  });

  it("should set KPI Trendlines as Homepage, Verify, revert to original homepage, And verify", () => {
    cy.wait(3000);

    cy.contains(
      "button.flex.gap-2.justify-between.w-full.items-center.text-left",
      "KPI Trendlines"
    ).realHover();

    cy.clickVisibleThreeDots();
    cy.contains("Set as Homepage").click();
    cy.wait(5000);

    cy.contains("Summary").click();
    cy.wait(10000);

    cy.get("button")
      .filter(':has(img[alt="Logo"])')
      .first()
      .click({ force: true });

    cy.wait(2000);

    cy.url().should("include", "partners/qa/reports/kpi-trendlines");

    cy.get("#__next", { timeout: 15000 }).should("exist");

    cy.contains("Table Viewer").closest("li").realHover();

    cy.clickVisibleThreeDots();

    cy.contains("Set as Homepage").click();

    cy.reload();

    cy.url().should("include", "partners/qa/reports/");
  });

  it("User can open and close the sidebar menu", () => {
    // Verify that the sidebar menu is open
    cy.contains("Exactius LLC. © All rights reserved, 2025.").should(
      "be.visible"
    );

    // Close the sidebar menu
    cy.get('button:has(svg[width="16"][height="16"][viewBox="0 0 16 16"])')
      .eq(1)
      .click();

    // Verify that the sidebar menu is closed
    cy.contains("Exactius LLC. © All rights reserved, 2025.").should(
      "not.be.visible"
    );

    // Open the sidebar menu
    cy.get('button:has(svg[width="16"][height="16"][viewBox="0 0 16 16"])')
      .eq(1)
      .click();

    // Verify that the sidebar menu is open
    cy.contains("Exactius LLC. © All rights reserved, 2025.").should(
      "be.visible"
    );
  });

  it("User can logoff and log back in", () => {
    // Click on the user icon to log off
    cy.get("#logout-modal").check({ force: true });

    // Click on the "Logout" button to confirm
    cy.get("button.btn.btn-primary.text-white").contains("Logout").click();

    // Verify that the login page is displayed
    cy.contains("Growth Starts Here", { timeout: 5000 }).should("be.visible");

    // Log back in

    cy.loginToVioletDev();

    cy.get("#__next", { timeout: 15000 }).should("exist");
  });

  it("Save current view, set as default and then remove it", () => {
    cy.wait(3000);

    //Create new view and set as default
    cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });
    cy.wait(3000);

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).should("be.visible");
    cy.wait(3000);

    //Verify that the new view is set as default
    cy.reload();
    cy.wait(3000);

    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.wait(3000);

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
    cy.wait(3000);

    cy.contains("Default").should("be.visible");
    cy.wait(3000);

    //Hover over the "Default" view and click the 3-dots menu
    cy.contains("Default").closest("div").realHover();
    cy.wait(3000);

    cy.clickVisibleThreeDots();
    cy.wait(3000);

    //uncheck the default view
    cy.get("#isDefault", { timeout: 45000 }).click();
    cy.wait(3000);

    cy.reload({ timeout: 45000 });
    cy.wait(3000);

    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.wait(3000);

    cy.contains("Views", { timeout: 40000 }).click();
    cy.wait(3000);

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains(AUTOMATION_VIEW_NAME).realHover();
    cy.wait(3000);

    cy.clickVisibleThreeDots();
    cy.wait(3000);

    //Delete the view
    cy.clickOnDeleteViewAndVerify();
  });

  it("User can create a public view", () => {
    //Create new public view
    cy.wait(5000);
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });
    cy.wait(5000);

    cy.reload();
    cy.wait(5000);

    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.wait(5000);

    // Verify it is set as public
    cy.wait(5000);

    cy.contains("Views", { timeout: 40000 }).click();
    cy.wait(5000);

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu

    cy.contains(AUTOMATION_VIEW_NAME).realHover();
    cy.wait(5000);

    cy.contains("You are sharing this view as a Team view", {
      timeout: 40000,
    }).should("be.visible");
    cy.wait(5000);

    //Change the view to non public
    cy.clickVisibleThreeDots();
    cy.wait(5000);

    cy.get("#isPublic", { timeout: 40000 }).click();
    cy.wait(5000);

    cy.contains("You are sharing this view as a Team view", {
      timeout: 40000,
    }).should("not.exist");
    cy.wait(5000);

    cy.reload();
    cy.wait(5000);

    //Verify the view is renamed
    cy.contains("Views", { timeout: 40000 }).click();
    cy.wait(5000);

    //Delete the view
    cy.contains(AUTOMATION_VIEW_NAME).realHover();
    cy.wait(5000);

    cy.clickVisibleThreeDots();
    cy.clickOnDeleteViewAndVerify();
  });
});
