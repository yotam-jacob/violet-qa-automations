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

  it("should open Table Viewer in new tab via 3-dots menu", () => {
    cy.wait(3000);
    cy.contains("Table Viewer")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.contains("Table Viewer").closest("li").realHover();

    cy.clickVisibleThreeDots();

    cy.contains("Open in New Tab").invoke("removeAttr", "target").click();

    cy.url().should("include", "/partners/qa/reports/");
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

    cy.get('button').filter(':has(img[alt="Logo"])').first().click({ force: true });

    cy.wait(2000);

    cy.url().should("include", "partners/qa/reports/kpi-trendlines");

    cy.get("#__next", { timeout: 15000 }).should("exist");

    cy.contains("Table Viewer").closest("li").realHover();

    cy.clickVisibleThreeDots();

    cy.contains("Set as Homepage").click();

    cy.reload();

    cy.url().should("include", "partners/qa/reports/");
  });

  it("Save current view, set as default and then remove it", () => {
    //Create new view and set as default
    cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).should("be.visible");

    //Verify that the new view is set as default
    cy.reload();
    cy.get("#__next", { timeout: 15000 }).should("exist");

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();

    cy.contains("Default").should("be.visible");

    //Hover over the "Default" view and click the 3-dots menu
    cy.contains("Default").closest("div").realHover();

    cy.clickVisibleThreeDots();

    //uncheck the default view
    cy.get("#isDefault", { timeout: 15000 }).click();

    cy.reload({ timeout: 15000 });
    cy.get("#__next", { timeout: 15000 }).should("exist");
    // cy.contains("Views", { timeout: 10000 }).click();
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains("Default", { timeout: 10000 }).realHover();

    cy.clickVisibleThreeDots();

    //Delete the view
    cy.clickOnDeleteViewAndVerify();
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

  it("User can use the lexicon without errors", () => {
    // Open on the lexicon icon
    cy.contains("button", "Lexicon").click({ force: true });

    // Verify that the lexicon is open
    cy.contains("📚 Lexicon").should("be.visible");

    // Close on the lexicon
    cy.contains("button", "Lexicon").click();

    // Verify that the lexicon is closed
    cy.contains("📚 Lexicon").should("not.be.visible");

    // Open on the lexicon icon
    cy.contains("button", "Lexicon").click();

    // Verify that the lexicon is open
    cy.contains("📚 Lexicon").should("be.visible");

    // Close on the lexicon using the 'x' button
    cy.get(
      "button.bg-gray-150.w-7.h-7.flex.justify-center.items-center.rounded-full"
    ).click();

    // Verify that the lexicon is closed
    cy.contains("📚 Lexicon").should("not.be.visible");

    // Open on the lexicon icon
    cy.contains("button", "Lexicon").click();

    // Verify that the lexicon is open
    cy.contains("📚 Lexicon").should("be.visible");

    // Open the lexicon in a new tab
    cy.get('a[href="/partners/qa/lexicon"]').then(($a) => {
      const href = $a.prop("href");
      cy.visit(href); // navigates to the lexicon page in same tab
    });

    // Verify url
    cy.url().should("include", "/partners/qa/lexicon");
  });
});
