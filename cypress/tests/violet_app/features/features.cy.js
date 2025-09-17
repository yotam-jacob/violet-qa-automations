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
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

    //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

    //Change the view to non public
    cy.clickVisibleThreeDots();

    cy.contains("Delete view", { timeout: 40000 }).click();

    cy.contains(
      'Are you sure you want to delete "' +
        AUTOMATION_VIEW_NAME +
        '" with the current filters and settings?',
      { timeout: 40000 }
    ).should("be.visible");

    cy.contains("button", "Remove", { timeout: 45000 }).click();
    cy.wait(2000);
    cy.reload();
  });

  it("User can use other users public view as its default view with consistency to reload, and return to previous state", () => {
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true, isDefault: true });

    cy.wait(1000);

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

    cy.wait(1000);

    // Selected the automation public view as default
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).realHover();
    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    cy.get("#isDefault", { timeout: 40000 }).click();

    cy.wait(1000);

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

    cy.visit("https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines");

    // public automation view is now default
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();

    cy.wait(1000);

    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).realHover();

    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);
    cy.get("#isDefault", { timeout: 40000 }).click();
    cy.wait(1000);

    // reload
    cy.visit("https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines");

    //unfiltered report is loaded
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 60000 }).click();
    cy.wait(1000);

    // delete the view
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    cy.clickOnDeleteViewAndVerify();
  });

  it("User can create a private view and the access a tooltip with correct time", () => {
    //Create new view
    cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true, isPublic: true });
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
    //Hover over the "Default" view and click the 3-dots menu
    cy.wait(1000);

    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    const now = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const datePart = now
      .toLocaleDateString("en-US", options)
      .replace(/(\w+)\s(\d{2}),\s(\d{4})/, "$2 $1 $3"); // "02 Sep 2025"

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timePart = `${hours}:`; // "09:" //validate only hours to avoid flakiness

    const fullText = "Modified: " + datePart + " " + timePart; // "Modified: 23 Jun 2025 09:"

    cy.contains(fullText).should("be.visible");

    //delete the view
    cy.clickOnDeleteViewAndVerify();
  });

  it("User can review the tooltip metada of public views from other users", () => {
    //open Views
    cy.contains("Views", { timeout: 40000 }).click();
    cy.wait(1000);

    //Hover over the AUTOMATION_PUBLIC_VIEW_NAME view and click the 3-dots menu
    cy.contains("div.w-full", AUTOMATION_PUBLIC_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);

    //open 3-dots menu
    cy.clickVisibleThreeDots();
    cy.wait(1000);
    // Verify the tooltip metadata
    cy.contains("Owner: Yotam Jacob").should("be.visible");

    cy.document().then(() => {
      const datePart = "15 Sep 2025";
      const regex = new RegExp(`Modified: ${datePart} \\d{2}:\\d{2}`);

      cy.contains(regex).should("be.visible");
    });
  });
});
