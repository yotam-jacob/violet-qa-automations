import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";
import { AUTOMATION_PUBLIC_VIEW_NAME } from "/cypress/support/constants.js";

describe("Features Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("Opening any saved view updates the URL with view={id} with persistent to refresh", () => {
    cy.createView(AUTOMATION_VIEW_NAME);

    //check the url contains view=
    cy.url().should("include", "view=");

    //store the view id in a variable
    cy.url()
      .then((url) => {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("view");
      })
      .as("viewId");

    //reload the page and verify the view is still applied
    cy.reload();

    cy.get("@viewId").then((viewId) => {
      cy.url().should("include", `view=${viewId}`);
    });

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

  it("Opening a public view with always load with the same view id", () => {
    //click on Views
    cy.contains("Views", { timeout: 40000 }).click();
    cy.contains(AUTOMATION_PUBLIC_VIEW_NAME, { timeout: 40000 }).click();
    cy.wait(1000);
    //Url should contain correct viewid
    cy.url().should("include", "view=dd0de051-c9a5-42ae-aaa2-60672fb4ab6a");
  });

  it("Open a public saved view and verify that the share button is enabled", () => {
    //create public view
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

    //Open share modal
    cy.get(
      "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
      { timeout: 25000 }
    )
      .eq(0)
      .should("be.visible")
      .click();

    //click on the copy button
    cy.get(
      "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
    ).within(() => {
      cy.get("button").each(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    });

    cy.reload();

    //change view to private
    cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
    cy.wait(1000);

    cy.contains("div.w-full", AUTOMATION_VIEW_NAME, {}).realHover();

    cy.clickVisibleThreeDots();
    cy.get("#isPublic").click();

    cy.reload();

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

    //Text is visible: Please set this view to Public in order to share it.
    cy.contains("Please set this view to Public in order to share it.", {
      timeout: 25000,
    })
      .should("be.visible")
      .should("exist");

    //click on "Make Public" button
    cy.contains("Make Public", { timeout: 25000 }).should("be.visible").click();

    //click on the second appearance of "Make Public" button
    cy.get('button:contains("Make Public")').eq(1).click();

    //Text is not visible: Please set this view to Public in order to share it.
    cy.contains("Please set this view to Public in order to share it.", {
      timeout: 25000,
    }).should("not.exist");

    //click on the copy button
    cy.get(
      "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
    ).within(() => {
      cy.get("button").each(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    });

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

  it("Click share on a public saved view and ensure it copies the current viewId URL", () => {
    //create public view
    cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

    //store the view id in a variable
    cy.url()
      .then((url) => {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("view");
      })
      .as("viewId");

    //Open share modal
    cy.get(
      "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
      { timeout: 25000 }
    )
      .eq(0)
      .should("be.visible")
      .click();

    // Stub clipboard write
    cy.window().then((win) => {
      expect(win.navigator, "navigator").to.have.property("clipboard");
      cy.stub(win.navigator.clipboard, "writeText").as("writeText");
    });

    //click on the copy button
    cy.get(
      "div.flex.relative.flex-col.w-full.gap-\\[5px\\].items-start"
    ).within(() => {
      cy.get("button").each(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    });

    cy.get("@viewId").then((viewId) => {
      cy.location().then((loc) => {
        const expectedUrl = `https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines?view=${viewId}`;
        cy.get("@writeText").should("have.been.calledOnceWith", expectedUrl);
      });
    });

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

  // it("Private views disable share and prompts the user to make it public before sharing including a warning text", () => {
    
  // });

  // it("Unfiltered views disable share and prompts the user to save it as new before sharing including a warning text", () => {});

  // it("Public views not owned by user disable share and prompts the user to save a personal copy before sharing including a warning text", () => {});

  // it("Deleting a saved view will revert to current default view", () => {});

  // it("Deleting a saved view will revert to unfiltered view", () => {});
});
