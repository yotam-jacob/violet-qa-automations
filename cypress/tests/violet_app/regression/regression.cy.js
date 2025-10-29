import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Regression Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletStg();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  // it("User can rename a view", () => {
  //   //Create new view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

  //   cy.reload();
  //   //Rename the view
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);

  //   //Hover over the view and click the 3-dots menu
  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);

  //   cy.contains("Rename view", { timeout: 40000 }).click();

  //   cy.get("input[value='Automation Test View']")
  //     .clear()
  //     .type("Automation Test View Renamed");

  //   cy.get("button.bg-main-primaryPurple").eq(0).click();

  //   cy.reload();

  //   cy.contains("Automation Test View Renamed", {
  //     timeout: 40000,
  //   })
  //     .should("be.visible")
  //     .click();
  //   cy.wait(1000);
  //   //Delete the view
  //   cy.contains("div.w-full", "Automation Test View Renamed").realHover();

  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);

  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("User can reset the current view by clicking on the reset button", () => {
  //   //Create new view
  //   cy.createView(AUTOMATION_VIEW_NAME);

  //   //Reset the view
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(5000);

  //   cy.contains("Reset", { timeout: 40000 }).click();
  //   cy.wait(5000);

  //   cy.contains("Views", { timeout: 40000 }).click();
  //   cy.wait(5000);
  //   cy.contains(AUTOMATION_VIEW_NAME).realHover();
  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();

  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("User can share a view through the share button", () => {
  //   //Create new public view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true, isDefault: true });

  //   cy.reload();
  //   cy.get("#__next", { timeout: 45000 }).should("exist");

  //   cy.wait(1000);

  //   //Open share modal and click on the share button
  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(0)
  //     .should("be.visible")
  //     .click();

  //   cy.wait(1000);

  //   cy.get("input#shareableLink")
  //     .invoke("val")
  //     .then((inputValue) => {
  //       cy.url().then((currentUrl) => {
  //         expect(inputValue).to.include(currentUrl);
  //       });
  //     });

  //   cy.window().then((win) => {
  //     if (win.navigator?.clipboard?.writeText) {
  //       cy.stub(win.navigator.clipboard, "writeText").as("clipboardWrite");
  //     }
  //   });

  //   cy.wait(1000);

  //   //click on the copy button
  //   cy.get(
  //     "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
  //   ).within(() => {
  //     cy.get("button").each(($btn) => {
  //       cy.wrap($btn).click({ force: true });
  //     });
  //   });

  //   cy.wait(1000);

  //   cy.get("@clipboardWrite", { timeout: 40000 }).should("have.been.called");

  //   cy.wait(1000);

  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 })
  //     .scrollIntoView()
  //     .click({ force: true });

  //   //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();

  //   // Delete the view
  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("User can download a view as a PDF file", () => {
  //   //Open download modal and click on the PDF button

  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(1)
  //     .should("be.visible")
  //     .click();

  //   cy.contains("PDF").click();
  // });

  // it("User can download a view as a Crosstab file", () => {
  //   //Open download modal and click on the Crosstab button

  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(1)
  //     .should("be.visible")
  //     .click();

  //   cy.contains("Crosstab").click();
  // });

  // it("User can open the login troubleshoot from the login screen", () => {
  //   cy.get("svg.h-6.w-6").should("be.visible").click({ force: true });

  //   cy.contains("Logout").click();

  //   cy.get("button.btn.btn-primary.text-white")
  //     .contains("Logout")
  //     .should("be.visible")
  //     .click();

  //   cy.get('a[href^="mailto:support@exacti.us"]').should(
  //     "contain.text",
  //     "here"
  //   );
  // });

  // it("User can see the company trademark", () => {
  //   cy.contains("Exactius LLC. © All rights reserved, 2025.").should(
  //     "be.visible"
  //   );

  //   cy.get("svg.h-6.w-6").should("be.visible").click({ force: true });

  //   cy.contains("Logout").click();

  //   cy.get("button.btn.btn-primary.text-white")
  //     .contains("Logout")
  //     .should("be.visible")
  //     .click();

  //   cy.contains("Exactius LLC. © All rights reserved, 2025.").should(
  //     "be.visible"
  //   );
  // });

  // it("Non Admin Users cannot access the manage page", () => {
  //   cy.contains("MANAGE QA").should("not.exist");
  // });

  // it("Space logo will change according to the space selected", () => {
  //   cy.get('img[alt="Space logo"]')
  //     .should(
  //       "have.attr",
  //       "src",
  //       "https://storage.googleapis.com/violet_staging/letters-qa-monogram-logo-5fdc8544-4827-4e48-b507-a009ec13a48f-1742728804618.jpg",
  //       { timeout: 25000 }
  //     )
  //     .and("be.visible");

  //   cy.get("svg.h-6.w-6").should("be.visible").click({ force: true });

  //   cy.contains("QA").click();
  //   cy.get("#__next", { timeout: 45000 }).should("exist");

  //   cy.get('img[alt="Space logo"]')
  //     .should(
  //       "have.attr",
  //       "src",
  //       "https://storage.googleapis.com/violet_staging/letters-qa-monogram-logo-5fdc8544-4827-4e48-b507-a009ec13a48f-1742728804618.jpg",
  //       { timeout: 25000 }
  //     )
  //     .and("be.visible");
  // });

  // it("measures and asserts homepage load time is acceptable", () => {
  //   cy.reload();

  //   cy.window().then((win) => {
  //     const timing = win.performance.timing;
  //     const loadTime = timing.loadEventEnd - timing.navigationStart;
  //     const finalLoadTime = loadTime > 0 ? loadTime : performance.now();

  //     const threshold = 4000; // milliseconds

  //     cy.log(`Page load time: ${Math.round(finalLoadTime)} ms`);
  //     expect(
  //       finalLoadTime,
  //       `Load time should be < ${threshold} ms`
  //     ).to.be.lessThan(threshold);
  //   });
  // });

  // it("verifies the window inner size matches the expected viewport", () => {
  //   it("resizes the window and ensures page still loads correctly", () => {
  //     // Start with desktop size
  //     cy.viewport(1280, 800);
  //     cy.visit("/");

  //     // Check main content renders initially
  //     cy.get("#__next", { timeout: 10000 }).should("exist").and("be.visible");

  //     // Resize to a mobile viewport
  //     cy.viewport("iphone-6");

  //     // Re-check that the page layout is still valid
  //     cy.get("#__next").should("exist").and("be.visible");

  //     // Resize back to desktop
  //     cy.viewport(1440, 900);

  //     // Check again that the core layout still renders
  //     cy.get("#__next").should("exist").and("be.visible");
  //   });
  // });

  // it("User can navigte to Exactius company page from the login screen", () => {
  //   cy.get("svg.h-6.w-6").should("be.visible").click({ force: true });

  //   cy.contains("Logout").click();

  //   cy.get("button.btn.btn-primary.text-white", { timeout: 10000 })
  //     .contains("Logout")
  //     .should("be.visible")
  //     .click();

  //   cy.get('a[href="https://exacti.us"]')
  //     .invoke("removeAttr", "target") // prevent opening in new tab
  //     .click();
  // });

  // it("Warning message should not appear when deleting an unused deefault view", () => {
  //   //Create new default view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });

  //   cy.reload();
  //   cy.get("#__next", { timeout: 45000 }).should("exist");

  //   cy.wait(1000);

  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 })
  //     .should("be.visible")
  //     .click();
  //   cy.wait(1000);

  //   //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();
  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);
  //   // Delete the view
  //   cy.contains("Delete view", { timeout: 40000 }).click();
  //   cy.wait(3000);
  //   //Message "Some users have set this view" should not appear
  //   cy.contains("Some users have set this view", { timeout: 0 }).should(
  //     "not.be.visible"
  //   );
  //   cy.contains("button", "Remove", { timeout: 45000 }).click();
  //   cy.wait(3000);
  //   cy.reload();
  //   cy.wait(3000);
  // });

  // it("Hovering over a dashboard name will hide the announcement icon", () => {
  //   // Go to dashboard
  //   cy.contains("Offline Schedule", { timeout: 40000 }).click();

  //   // Hover the row that has the text "KPI Trendlines"
  //   cy.contains("KPI Trendlines", { timeout: 40000 })
  //     .closest("div.group.relative.flex.w-full.items-center")
  //     .as("kpiRow")
  //     .realHover();

  //   // Assert: in this row, the beta badge is not visible
  //   cy.get("@kpiRow").within(() => {
  //     cy.get(".bg-status-beta").then(($badge) => {
  //       if ($badge.length) {
  //         // Force a visibility check on that exact element
  //         expect(
  //           Cypress.$($badge).is(":visible"),
  //           "beta badge should not be visible after hover"
  //         ).to.eq(false);
  //       } else {
  //         // no beta badge in this row at all - also OK
  //         expect($badge.length, "no beta badge present").to.eq(0);
  //       }
  //     });
  //   });
  // });

  it("Create a default view and then refresh - view is still default", () => {
    //Create new default view
    cy.get("#__next", { timeout: 45000 }).should("exist");

    cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).should("be.visible");

    cy.wait(1000);

    cy.reload();
    cy.get("#__next", { timeout: 45000 }).should("exist");

    cy.wait(1000);

    // Assert that the created view is still default
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 })
      .should("be.visible")
      .click();
    cy.wait(1000);

    //Validate that the "Default" label is present next to the view name
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, "Default", {
      timeout: 10000,
    }).should("be.visible");

    //Delete the view
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

    cy.wait(1000);

    cy.clickVisibleThreeDots();
    cy.wait(1000);

    cy.clickOnDeleteViewAndVerify();
  });

  // it("", () => {});

  // it("", () => {});

  // it("", () => {});

  // it("", () => {});

  // it("", () => {});

  // it("", () => {});
});
