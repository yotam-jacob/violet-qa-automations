import { gtmExpectedEvents } from "/cypress/fixtures/gtmEventsPayloads.js";
import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("analytics Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
  });

  let consoleMessages = [];

  Cypress.on("window:before:load", (win) => {
    const originalLog = win.console.log;
    win.console.log = function (...args) {
      args.forEach((arg, index) => {
        if (typeof arg === "string" && arg.startsWith("[GTM Event]:")) {
          const nextArg = args[index + 1];
          if (typeof nextArg === "object" && nextArg !== null) {
            consoleMessages.push({
              label: arg,
              data: nextArg,
            });
          } else {
            consoleMessages.push({
              label: arg,
              data: null,
            });
          }
        }
      });
      originalLog.apply(win.console, args);
    };
  });

  describe("GTM Events Validation", () => {
    it("tests three_dots_default event payload", () => {
      //Create new view and set as default
      cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true, isPublic: true });
      cy.wait(3000); //necessary for elements loading

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).should(
        "be.visible"
      );
      cy.wait(3000);

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
      //Hover over the "Default" view and click the 3-dots menu

      cy.get("*").then(($elements) => {
        const matching = $elements.filter((i, el) =>
          el.textContent.includes(AUTOMATION_VIEW_NAME)
        );
        cy.wrap(matching.eq(1)).contains("Default").realHover();
      });
      cy.clickVisibleThreeDots();
      //uncheck the default view
      cy.wait(3000);

      cy.get("#isDefault", { timeout: 45000 }).click();
      cy.wait(3000);

      cy.reload({ timeout: 45000 });
      cy.wait(3000);

      cy.get("#__next", { timeout: 45000 }).should("exist");
      cy.wait(3000);

      cy.reload({ timeout: 45000 });
      cy.wait(3000);

      cy.get("#__next", { timeout: 45000 }).should("exist");
      cy.wait(3000);

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

      cy.wait(3000);
      cy.clickVisibleThreeDots();
      //Delete the view
      cy.wait(3000);

      cy.clickOnDeleteViewAndVerify();
      cy.wait(3000);

      cy.validateGtmEvent(
        "3-dots view menu click",
        gtmExpectedEvents.three_dots_default,
        consoleMessages
      );
    });

    it("tests three_dots_public event payload", () => {
      //Create new public view
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

      cy.reload();
      cy.get("#__next", { timeout: 45000 }).should("exist");

      // Verify it is set as public

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 60000 }).click();

      //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

      cy.contains("You are sharing this view as a Team view")
        .contains(AUTOMATION_VIEW_NAME)
        .should("be.visible");

      //Change the view to non public
      cy.clickVisibleThreeDots();

      cy.get("#isPublic").click();
      cy.contains("You are sharing this view as a Team view")
        .contains(AUTOMATION_VIEW_NAME)
        .should("not.exist");

      // Delete the view
      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "3-dots view menu click",
        gtmExpectedEvents.three_dots_public,
        consoleMessages
      );
    });

    it("tests report_click event payload", () => {
      cy.visit(
        "https://dev.violetgrowth.com/partners/qa/reports/kpi-trendlines"
      );
      cy.wait(3000);
      cy.contains("KPI Trendlines", { timeout: 30000 }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "report_click",
        gtmExpectedEvents.report_click,
        consoleMessages
      );
    });

    it("tests report_load event payload", () => {
      cy.contains("KPI Trendlines", { timeout: 10000 }).click();
      cy.wait(1000); //need this to wait for the report to load
      cy.validateGtmEvent(
        "report_load",
        gtmExpectedEvents.report_load,
        consoleMessages
      );
    });

    it("tests actions_menu_click event payload", () => {
      cy.wait(4000);

      cy.contains("Views", { timeout: 40000 }).click();
      cy.wait(4000);

      cy.validateGtmEvent(
        "actions_menu_click",
        gtmExpectedEvents.actions_menu_click,
        consoleMessages
      );
    });

    it("tests views_menu_click_reset event payload", () => {
      cy.wait(3000);
      cy.contains("Views", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Reset", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "views_menu_click",
        gtmExpectedEvents.views_menu_click_reset,
        consoleMessages
      );
    });

    it("tests share_menu_click event payload", () => {
      //Create new public view
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true, isDefault: true });

      cy.reload();
      cy.get("#__next", { timeout: 45000 }).should("exist");

      cy.wait(2000);

      //Open share modal and click on the share button
      cy.get(
        "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
        { timeout: 25000 }
      )
        .eq(0)
        .should("be.visible")
        .click();

      cy.wait(2000);

      cy.window().then((win) => {
        if (!win.navigator.clipboard) {
          win.navigator.clipboard = {};
        }

        // Provide a no-op function that prevents errors
        win.navigator.clipboard.writeText = () => Promise.resolve();
      });

      cy.wait(2000);

      cy.get(".h-3.w-3", { timeout: 25000 }).click();
      cy.wait(2000);

      //Close share modal
      cy.get(
        "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
        { timeout: 25000 }
      )
        .eq(0)
        .should("be.visible")
        .click();

      cy.validateGtmEvent(
        "share_menu_click",
        gtmExpectedEvents.share_menu_click,
        consoleMessages
      );

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

      //Hover over the AUTOMATION_VIEW_NAME view and click the 3-dots menu
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME)
        .find("div.group\\/item.relative")
        .realHover();

      //Change the view to non public
      cy.clickVisibleThreeDots();

      // Delete the view
      cy.clickOnDeleteViewAndVerify();
    });

    it("tests download_menu_click event payload", () => {
      //Open download modal
      cy.wait(3000);

      cy.get(
        "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
        { timeout: 25000 }
      )
        .eq(1)
        .should("be.visible")
        .click();
      cy.wait(3000);

      cy.contains("PDF").click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "download_menu_click",
        gtmExpectedEvents.download_menu_click,
        consoleMessages
      );
    });

    it("tests filter_picked event payload", () => {
      cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
      cy.contains("button", "PopSells", { timeout: 20000 }).click();
      cy.contains("PopSells2", { timeout: 10000 }).click();

      cy.validateGtmEvent(
        "filter_picked",
        gtmExpectedEvents.filter_picked,
        consoleMessages
      );
    });

    it("tests save_view_modal_clicks_cancel event payload", () => {
      cy.contains("Views", { timeout: 40000 }).click();
      cy.contains("Save as New", { timeout: 40000 }).click();
      cy.get("div.fixed.top-0.left-0.w-full.h-full:visible").each(($modal) => {
        cy.wrap($modal).within(() => {
          cy.contains("button", /^cancel$/i)
            .should("be.visible")
            .click();
        });
      });

      cy.validateGtmEvent(
        "save view modal clicks",
        gtmExpectedEvents.save_view_modal_clicks_cancel,
        consoleMessages
      );
    });

    it("tests views_menu_click event payload", () => {
      //Create new view
      cy.wait(3000);
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });
      cy.wait(3000);
      cy.reload();
      cy.wait(3000);

      //Verify the view is renamed
      cy.wait(3000);

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 20000 }).click();
      cy.wait(3000);

      //Delete the view
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME)
        // .find("div.group\\/item.relative")
        .realHover();
      cy.wait(3000);

      cy.clickVisibleThreeDots();
      cy.wait(3000);

      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "views_menu_click",
        gtmExpectedEvents.views_menu_click,
        consoleMessages
      );
    });

    it("tests views_menu_click_rename event payload", () => {
      //Create new view
      cy.wait(3000);
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });
      cy.wait(3000);

      cy.reload();
      cy.wait(3000);

      //Rename the view
      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
      //Hover over the view and click the 3-dots menu
      cy.wait(3000);

      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

      cy.wait(3000);

      cy.clickVisibleThreeDots();
      cy.wait(3000);

      cy.contains("Rename view", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.get("input[value='Automation Test View']")
        .clear()
        .type("Automation Test View Renamed");
      cy.wait(3000); //necessary for elements loading

      cy.get("button.bg-main-primaryPurple").eq(0).click();
      cy.wait(3000); //necessary for elements loading

      cy.reload();

      //Verify the view is renamed
      cy.contains("Automation Test View Renamed", { timeout: 40000 }).click();
      cy.wait(3000);

      //Delete the view
      cy.contains("div.w-full", "Automation Test View Renamed").realHover();
      cy.wait(3000);

      cy.clickVisibleThreeDots();
      cy.wait(3000); //necessary for elements loading

      cy.clickOnDeleteViewAndVerify();
      cy.wait(3000); //necessary for elements loading

      cy.validateGtmEvent(
        "3-dots view menu click",
        gtmExpectedEvents.views_menu_click_rename,
        consoleMessages
      );
    });

    it("tests views_menu_click_delete event payload", () => {
      //Create new view
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });

      cy.reload();
      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
      //Hover over the view and click the 3-dots menu
      cy.wait(3000);

      //Delete the view
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();
      cy.wait(3000);
      cy.clickVisibleThreeDots();
      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "remove_view_modal_click_remove",
        gtmExpectedEvents.remove_view_modal_click_remove,
        consoleMessages
      );
    });

    it("tests sidebar toggle event payload", () => {
      // Close the sidebar menu
      cy.get('button:has(svg[width="16"][height="16"][viewBox="0 0 16 16"])')
        .eq(1)
        .click();

      cy.validateGtmEvent(
        "toggle sidebar",
        gtmExpectedEvents.toggle_sidebar,
        consoleMessages
      );
    });

    it("tests insight_thumb_rating event payload", () => {
      cy.wait(3000);
      cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
      cy.wait(3000);

      cy.get(".cursor-pointer.bg-white", { timeout: 40000 }).first().click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "insight_thumb_rating",
        gtmExpectedEvents.insight_thumb_rating,
        consoleMessages
      );
    });
  });
});
