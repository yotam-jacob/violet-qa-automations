import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Regression Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  // it("User can rename a view", () => {
  //   //Create new view
  //   cy.createView(AUTOMATION_VIEW_NAME);

  //   cy.reload();
  //   //Rename the view
  //   cy.contains("Views", { timeout: 10000 }).click();

  //   //Hover over the view and click the 3-dots menu
  //   cy.contains(AUTOMATION_VIEW_NAME).closest("div").realHover();

  //   cy.clickVisibleThreeDots();

  //   cy.contains("Rename view", { timeout: 10000 }).click();

  //   cy.get("input[value='Automation Test View']").clear();

  //   cy.get("input[type='text']").type("Automation Test View Renamed");

  //   cy.get("button.bg-main-primaryPurple").eq(0).click();

  //   cy.reload();

  //   //Verify the view is renamed
  //   cy.contains("Views", { timeout: 10000 }).click();

  //   cy.contains("Automation Test View Renamed", {
  //     timeout: 10000,
  //   }).should("be.visible");

  //   //Delete the view
  //   cy.contains(
  //     "button.font-inter.flex.justify-between.group.items-center.relative.leading-3.px-2\\.5.font-medium.w-full.text-start.rounded-md.text-\\[13px\\].text-main-primaryDarkBlue.hover\\:bg-gray-150",
  //     AUTOMATION_VIEW_NAME
  //   ).realHover();

  //   cy.clickVisibleThreeDots();
  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("User can create a public view", () => {
  //   //Create new public view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

  //   cy.reload();
  //   cy.get("#__next", { timeout: 15000 }).should("exist");

  //   // Verify it is set as public

  //   cy.contains("Views", { timeout: 10000 }).click();

  //   //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME)
  //     .find("div.group\\/item.relative")
  //     .realHover();

  //   cy.contains("You are sharing this view as a Team view").should(
  //     "be.visible"
  //   );

  //   //Change the view to non public
  //   cy.clickVisibleThreeDots();

  //   cy.get("#isPublic").click();
  //   cy.contains("You are sharing this view as a Team view").should("not.exist");

  //   // Delete the view
  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("User can reset the current view by clicking on the reset button", () => {
  //   //Create new view
  //   cy.createView(AUTOMATION_VIEW_NAME);

  //   //Reset the view
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();

  //   cy.contains("Reset").click();

  //   //Delete the view
  //   cy.contains("Views", { timeout: 10000 }).click();

  //   cy.contains(
  //     "button.font-inter.flex.justify-between.group.items-center.relative.leading-3.px-2\\.5.font-medium.w-full.text-start.rounded-md.text-\\[13px\\].text-main-primaryDarkBlue.hover\\:bg-gray-150",
  //     AUTOMATION_VIEW_NAME
  //   ).realHover();

  //   cy.clickVisibleThreeDots();

  //   cy.clickOnDeleteViewAndVerify();
  // });

  it("User can share a view through the share button", () => {
    //Open share modal and click on the share button
    cy.get(
      "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
      { timeout: 25000 }
    )
      .eq(0)
      .should("be.visible")
      .click();

    cy.get("input#shareableLink")
      .invoke("val")
      .then((inputValue) => {
        cy.url().then((currentUrl) => {
          expect(inputValue).to.include(currentUrl);
        });
      });

    cy.window().then((win) => {
      if (win.navigator?.clipboard?.writeText) {
        cy.stub(win.navigator.clipboard, "writeText").as("clipboardWrite");
      }
    });

    cy.get(
      "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
    ).within(() => {
      cy.get("button").each(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    });

    cy.get("@clipboardWrite").should("have.been.called");
  });

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

  // it("Partner logo will change according to the partner selected", () => {
  //   cy.get('img[alt="Partner logo"]')
  //     .should(
  //       "have.attr",
  //       "src",
  //       "https://storage.googleapis.com/violet_dev/letters-qa-monogram-logo-5fdc8544-4827-4e48-b507-a009ec13a48f-1742479975649.jpg"
  //     )
  //     .and("be.visible");

  //   cy.get("svg.h-6.w-6").should("be.visible").click({ force: true });

  //   cy.contains("dev").click();
  //   cy.get("#__next", { timeout: 15000 }).should("exist");

  //   cy.get('img[alt="Partner logo"]')
  //     .should(
  //       "have.attr",
  //       "src",
  //       "https://storage.googleapis.com/violet_dev/20170301123009!Google__G__logo-1726743137687.svg"
  //     )
  //     .and("be.visible");
  // });

  // const routes = [
  //   "/partners/qa/reports/kpi-trendlines",
  //   "/partners/qa/reports/appointments-tracker",
  //   "/partners/qa/reports/offline-schedule",
  // ];

  // const repeatCount = 10;

  // it(`repeatedly navigates between ${routes.length} main pages, ${repeatCount} times`, () => {
  //   for (let i = 0; i < repeatCount; i++) {
  //     routes.forEach((route) => {
  //       cy.visit(route);
  //       cy.get("#__next", { timeout: 10000 }).should("exist");
  //       cy.url().should("include", route);
  //       cy.contains(/not found/i).should("not.exist"); // case-insensitive check
  //     });
  //   }
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
});
