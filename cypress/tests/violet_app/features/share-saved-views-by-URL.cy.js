import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";
import { AUTOMATION_PUBLIC_VIEW_NAME } from "/cypress/support/constants.js";
import { AUTOMATION_PUBLIC_VIEW_ID } from "/cypress/support/constants.js";

describe("Features Test Suite", () => {
  beforeEach(() => {
    cy.cdnVisit("/login?from=/");
    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains("Sign in with email", { timeout: 45000 }).should("be.visible");
    cy.loginToVioletStg();
  });

  // it("Opening any saved view updates the URL with view={id} with persistent to refresh", () => {
  //   cy.createView(AUTOMATION_VIEW_NAME);

  //   //check the url contains view=
  //   cy.url().should("include", "view=");

  //   //store the view id in a variable
  //   cy.url()
  //     .then((url) => {
  //       const urlObj = new URL(url);
  //       return urlObj.searchParams.get("view");
  //     })
  //     .as("viewId");

  //   //reload the page and verify the view is still applied
  //   cy.reload();

  //   cy.get("@viewId").then((viewId) => {
  //     cy.url().should("include", `view=${viewId}`);
  //   });

  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);

  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
  //     timeout: 40000,
  //   }).realHover();

  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);

  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("Opening a public view with always load with the same view id", () => {
  //   //click on Views
  //   cy.contains("Views", { timeout: 40000 }).click();
  //   cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);
  //   //Url should contain correct viewid
  //   cy.url().should("include", "view=" + AUTOMATION_PUBLIC_VIEW_ID);
  // });

  // it("Open a public saved view and verify that the share button is enabled", () => {
  //   //create public view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

  //   //Open share modal
  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(0)
  //     .should("be.visible")
  //     .click();

  //   //click on the copy button
  //   cy.get(
  //     "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
  //   ).within(() => {
  //     cy.get("button").each(($btn) => {
  //       cy.wrap($btn).click({ force: true });
  //     });
  //   });

  //   cy.reload();

  //   //change view to private
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(2000);

  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {}).realHover();
  //   cy.wait(2000);

  //   cy.clickVisibleThreeDots();
  //   cy.get("#isPublic").click();

  //   cy.reload();

  //   //Open share modal
  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(0)
  //     .should("be.visible")
  //     .click();

  //   cy.get("button:disabled.bg-purple-500.opacity-50")
  //     .should("be.disabled")
  //     .and("be.visible");

  //   //Text is visible: Please set this view to Public in order to share it.
  //   cy.contains("Please set this view to Public in order to share it.", {
  //     timeout: 25000,
  //   })
  //     .should("be.visible")
  //     .should("exist");

  //   //click on "Make Public" button
  //   cy.contains("Make Public", { timeout: 25000 }).should("be.visible").click();

  //   //click on the second appearance of "Make Public" button
  //   cy.get('button:contains("Make Public")').eq(1).click();

  //   //Text is not visible: Please set this view to Public in order to share it.
  //   cy.contains("Please set this view to Public in order to share it.", {
  //     timeout: 25000,
  //   }).should("not.exist");

  //   //click on the copy button
  //   cy.get(
  //     "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
  //   ).within(() => {
  //     cy.get("button").each(($btn) => {
  //       cy.wrap($btn).click({ force: true });
  //     });
  //   });

  //   //delete view and finish
  //   cy.reload();
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);

  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
  //     timeout: 40000,
  //   }).realHover();

  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);
  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("Click share on a public saved view and ensure it copies the current viewId URL", () => {
  //   //create public view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

  //   //store the view id in a variable
  //   cy.url()
  //     .then((url) => {
  //       const urlObj = new URL(url);
  //       return urlObj.searchParams.get("view");
  //     })
  //     .as("viewId");

  //   //Open share modal
  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(0)
  //     .should("be.visible")
  //     .click();

  //   // Stub clipboard write
  //   cy.window().then((win) => {
  //     expect(win.navigator, "navigator").to.have.property("clipboard");
  //     cy.stub(win.navigator.clipboard, "writeText").as("writeText");
  //   });

  //   //click on the copy button
  //   cy.get(
  //     "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
  //   ).within(() => {
  //     cy.get("button").each(($btn) => {
  //       cy.wrap($btn).click({ force: true });
  //     });
  //   });

  //   cy.get("@viewId").then((viewId) => {
  //     cy.location().then((loc) => {
  //       const expectedUrl = `https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines?view=${viewId}`;
  //       cy.get("@writeText").should("have.been.calledOnceWith", expectedUrl);
  //     });
  //   });

  //   //delete view and finish
  //   cy.reload();
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);

  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
  //     timeout: 40000,
  //   }).realHover();
  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);
  //   cy.clickOnDeleteViewAndVerify();
  // });

  // it("Private views disable share and prompts the user to make it public before sharing including a warning text", () => {
  //   //create private view
  //   cy.createView(AUTOMATION_VIEW_NAME, { isPublic: false });

  //   //Open share modal
  //   cy.get(
  //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
  //     { timeout: 25000 }
  //   )
  //     .eq(0)
  //     .should("be.visible")
  //     .click();
  //   cy.get("button:disabled.bg-purple-500.opacity-50")
  //     .should("be.disabled")
  //     .and("be.visible");

  //   //Text is visible: Please set this view to Public in order to share it.
  //   cy.contains("Please set this view to Public in order to share it.", {
  //     timeout: 25000,
  //   })
  //     .should("be.visible")
  //     .should("exist");

  //   //click on "Make Public" button
  //   cy.contains("Make Public", { timeout: 25000 }).should("be.visible").click();

  //   //click on the second appearance of "Make Public" button
  //   cy.get('button:contains("Make Public")').eq(1).click();
  //   //Text is not visible: Please set this view to Public in order to share it.
  //   cy.contains("Please set this view to Public in order to share it.", {
  //     timeout: 25000,
  //   }).should("not.exist");

  //   //click on the copy button
  //   cy.get(
  //     "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
  //   ).within(() => {
  //     cy.get("button").each(($btn) => {
  //       cy.wrap($btn).click({ force: true });
  //     });
  //   });
  //   //delete view and finish
  //   cy.reload();
  //   cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
  //   cy.wait(1000);

  //   cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
  //     timeout: 40000,
  //   }).realHover();
  //   cy.wait(1000);

  //   cy.clickVisibleThreeDots();
  //   cy.wait(1000);
  //   cy.clickOnDeleteViewAndVerify();
  // });

  it("Unfiltered views disable share and prompts the user to save it as new before sharing including a warning text", () => {
    //Open share modal
    cy.get(
      "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
      { timeout: 25000 }
    )
      .eq(0)
      .should("be.visible")
      .click();
    cy.get("button:disabled.bg-purple-500.opacity-50")
      .should("be.disabled")
      .and("be.visible");

    //Text is visible: This is an unsaved view. Please save your changes as a new view.
    cy.contains(
      "This is an unsaved view. Please save your changes as a new view.",
      {
        timeout: 25000,
      }
    )
      .should("be.visible")
      .should("exist");
    //click on "Save as New" button
    cy.contains("Save as New", { timeout: 25000 }).should("be.visible").click();

    //Enter view name
    cy.get('input[id="viewName"]').type(AUTOMATION_VIEW_NAME);
    //click on "Save" button
    cy.contains(/^Save$/, { timeout: 25000 })
      .should("be.visible")
      .click();
    cy.wait(3000);
    //Text is not visible: Please save this view as a new view in order to share it.
    cy.contains("Please save this view as a new view in order to share it.", {
      timeout: 25000,
    }).should("not.exist");
    cy.wait(3000);

    //click on the copy button
    cy.get(
      "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
    ).within(() => {
      cy.get("button").each(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    });
    cy.wait(3000);

    //delete view and finish
    cy.reload();
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
    cy.wait(1000);

    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);
    cy.clickVisibleThreeDots();
    cy.wait(1000);
    cy.clickOnDeleteViewAndVerify();
  });

  it("Deleting a saved view will revert to current default view", () => {
    //Create a new view
    cy.createView(AUTOMATION_VIEW_NAME);
    cy.wait(2000);

    //make sure the url containd the view id
    cy.url().should("include", "view=");
    //Make the public automation view default
    cy.wait(2000);
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 })
      .should("be.visible")
      .realHover();
    cy.wait(2000);
    cy.clickVisibleThreeDots();
    cy.get("#isDefault", { timeout: 45000 }).click();
    cy.wait(2000);

    //Delete the new view
    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);
    cy.clickVisibleThreeDots();
    cy.wait(1000);
    cy.clickOnDeleteViewAndVerify();

    //reload to report by navigating to: https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines
    cy.visit(
      "https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines"
    );
    cy.wait(1000);

    //Verify the default view is applied by checking the url contains the default view id
    cy.url().should("include", "view=" + AUTOMATION_PUBLIC_VIEW_ID, {
      timeout: 40000,
    });
    //Revert the default view to blank
    cy.wait(2000);
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();
    cy.contains("div.w-full", AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 })
      .should("be.visible")
      .realHover();
    cy.wait(2000);
    cy.clickVisibleThreeDots();
    cy.get("#isDefault", { timeout: 45000 }).click();
    //reload to report by navigating to: https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines
    cy.visit(
      "https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines"
    );

    cy.url().should("not.include", "view=" + AUTOMATION_PUBLIC_VIEW_ID);
  });

  it("Deleting a saved view will revert to unfiltered view", () => {
    //Create a new view
    cy.createView(AUTOMATION_VIEW_NAME);
    cy.wait(2000);

    //make sure the url containd the view id
    cy.url().should("include", "view=");

    //Delete the new view
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {
      timeout: 40000,
    }).realHover();
    cy.wait(1000);
    cy.clickVisibleThreeDots();
    cy.wait(1000);
    cy.clickOnDeleteViewAndVerify();
    //click on KPI Trendlines to reload the report
    cy.contains("KPI Trendlines", { timeout: 40000 }).click();
    cy.wait(1000);

    //Verify the default view is applied by checking the url does not contain view=
    cy.url().should("not.include", "view=");
  });
});
