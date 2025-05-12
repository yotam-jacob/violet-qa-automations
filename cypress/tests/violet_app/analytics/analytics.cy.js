import { gtmExpectedEvents } from "/cypress/fixtures/gtmEventsPayloads.js";
import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("analytics Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
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
    // it("tests user_login event payload", () => {
    //   cy.wait(1000);
    //   cy.validateGtmEvent(
    //     "user_login",
    //     gtmExpectedEvents.user_login,
    //     consoleMessages
    //   );
    // });

    // it("tests report_click event payload", () => {
    //   cy.visit(
    //     "https://dev.violetgrowth.com/partners/qa/reports/kpi-trendlines"
    //   );
    //   cy.contains("KPI Trendlines", { timeout: 10000 }).click();
    //   cy.validateGtmEvent(
    //     "report_click",
    //     gtmExpectedEvents.report_click,
    //     consoleMessages
    //   );
    // });

    // it("tests report_load event payload", () => {
    //   cy.contains("KPI Trendlines", { timeout: 10000 }).click();
    //   cy.wait(1000); //need this to wait for the report to load
    //   cy.validateGtmEvent(
    //     "report_load",
    //     gtmExpectedEvents.report_load,
    //     consoleMessages
    //   );
    // });

    // it("tests actions_menu_click event payload", () => {
    //   cy.contains("Views", { timeout: 40000 }).click();
    //   cy.validateGtmEvent(
    //     "actions_menu_click",
    //     gtmExpectedEvents.actions_menu_click,
    //     consoleMessages
    //   );
    // });

    // it("tests views_menu_click event payload", () => {
    //   cy.contains("Views", { timeout: 10000 }).click();
    //   cy.contains("Reset", { timeout: 10000 }).click();
    //   cy.validateGtmEvent(
    //     "views_menu_click",
    //     gtmExpectedEvents.views_menu_click_reset,
    //     consoleMessages
    //   );
    // });

    // it("tests share_menu_click event payload", () => {
    //   //Open share modal and click on the share button
    //   cy.get(
    //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
    //     { timeout: 25000 }
    //   )
    //     .eq(0)
    //     .should("be.visible")
    //     .click();

    //   cy.window().then((win) => {
    //     if (!win.navigator.clipboard) {
    //       win.navigator.clipboard = {};
    //     }

    //     // Provide a no-op function that prevents errors
    //     win.navigator.clipboard.writeText = () => Promise.resolve();
    //   });

    //   cy.get(".h-3.w-3").click();
    //   cy.validateGtmEvent(
    //     "share_menu_click",
    //     gtmExpectedEvents.share_menu_click,
    //     consoleMessages
    //   );
    // });

    // it("tests download_menu_click event payload", () => {
    //   //Open download modal

    //   cy.get(
    //     "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
    //     { timeout: 25000 }
    //   )
    //     .eq(1)
    //     .should("be.visible")
    //     .click();

    //   cy.contains("PDF").click();

    //   cy.validateGtmEvent(
    //     "download_menu_click",
    //     gtmExpectedEvents.download_menu_click,
    //     consoleMessages
    //   );
    // });

    // it("tests filter_picked event payload", () => {
    //   cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
    //   cy.wait(1000);
    //   cy.contains("button", "ERC").click();
    //   cy.wait(1000);
    //   cy.contains("Pathlight", { timeout: 10000 }).click();

    //   cy.validateGtmEvent(
    //     "filter_picked",
    //     gtmExpectedEvents.filter_picked,
    //     consoleMessages
    //   );
    // });

    // it("tests save_view_modal_clicks_cancel event payload", () => {
    //   cy.contains("Views", { timeout: 10000 }).click();
    //   cy.contains("Save as New", { timeout: 10000 }).click();
    //   cy.contains("Cancel", { timeout: 10000 }).click();

    //   cy.validateGtmEvent(
    //     "save view modal clicks",
    //     gtmExpectedEvents.save_view_modal_clicks_cancel,
    //     consoleMessages
    //   );
    // });

    // it("tests save_view_modal_clicks_save event payload", () => {
    //   //Create new view
    //   cy.createView(AUTOMATION_VIEW_NAME);

    //   cy.validateGtmEvent(
    //     "save view modal clicks",
    //     gtmExpectedEvents.save_view_modal_clicks_save,
    //     consoleMessages
    //   );

    //   cy.reload();

    //   //Verify the view is renamed
    //   cy.contains("Views", { timeout: 10000 }).click();

    //   //Delete the view
    //   cy.contains(AUTOMATION_VIEW_NAME).realHover();

    //   cy.clickVisibleThreeDots();
    //   cy.clickOnDeleteViewAndVerify();
    // });

    // it("tests views_menu_click event payload", () => {
    //   //Create new view
    //   cy.createView(AUTOMATION_VIEW_NAME);

    //   cy.reload();

    //   //Verify the view is renamed
    //   cy.contains("Views", { timeout: 10000 }).click();

    //   //Delete the view
    //   cy.contains(AUTOMATION_VIEW_NAME).realHover();

    //   cy.clickVisibleThreeDots();
    //   cy.clickOnDeleteViewAndVerify();

    //   cy.validateGtmEvent(
    //     "views_menu_click",
    //     gtmExpectedEvents.views_menu_click,
    //     consoleMessages
    //   );
    // });

    // it("tests views_menu_click_rename event payload", () => {
    //   //Create new view
    //   cy.createView(AUTOMATION_VIEW_NAME);

    //   cy.reload();
    //   //Rename the view
    //   cy.contains("Views", { timeout: 10000 }).click();

    //   cy.wait(3000);
    //   //Hover over the view and click the 3-dots menu
    //   cy.contains(AUTOMATION_VIEW_NAME).realHover();
    //   cy.wait(3000);

    //   cy.clickVisibleThreeDots();
    //   cy.wait(3000);

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

    //   cy.validateGtmEvent(
    //     "3-dots view menu click",
    //     gtmExpectedEvents.views_menu_click_rename,
    //     consoleMessages
    //   );
    // });

    // it("tests views_menu_click_delete event payload", () => {
    //   //Create new view
    //   cy.createView(AUTOMATION_VIEW_NAME);

    //   cy.reload();

    //   //Verify the view is renamed
    //   cy.contains("Views", { timeout: 10000 }).click();
    //   cy.wait(1000);
    //   //Hover over the view and click the 3-dots menu
    //   cy.contains(AUTOMATION_VIEW_NAME).realHover();
    //   cy.wait(1000);

    //   cy.clickVisibleThreeDots();
    //   cy.wait(1000);

    //   cy.clickOnDeleteViewAndVerify();

    //   cy.validateGtmEvent(
    //     "views_menu_click",
    //     gtmExpectedEvents.views_menu_click_delete,
    //     consoleMessages
    //   );
    // });

    it("tests three_dots_default event payload", () => {
      //Create new view and set as default
      // cy.wait(3000);

      cy.createView(AUTOMATION_VIEW_NAME, { isDefault: true });

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).should(
        "be.visible"
      );

      //Verify that the new view is set as default
      cy.reload();
      cy.get("#__next", { timeout: 15000 }).should("exist");

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();

      //Hover over the "Default" view and click the 3-dots menu

      cy.contains("Default").realHover();

      // cy.contains("Default").closest("div").realHover();

      cy.clickVisibleThreeDots();

      //uncheck the default view
      cy.get("#isDefault", { timeout: 15000 }).click();

      cy.reload({ timeout: 15000 });
      cy.get("#__next", { timeout: 15000 }).should("exist");

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 10000 }).click();
      // cy.wait(3000);
      cy.contains("Default").realHover();
      // cy.contains("Default").closest("div").realHover();
      // cy.wait(3000);
      cy.clickVisibleThreeDots();
      //Delete the view
      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "3-dots view menu click",
        gtmExpectedEvents.three_dots_default,
        consoleMessages
      );
    });

    // it("tests three_dots_public event payload", () => {
    //   cy.wait(3000);

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
    //   cy.contains("You are sharing this view as a Team view").should(
    //     "not.exist"
    //   );

    //   // Delete the view
    //   cy.clickOnDeleteViewAndVerify();

    //   cy.validateGtmEvent(
    //     "3-dots view menu click",
    //     gtmExpectedEvents.three_dots_public,
    //     consoleMessages
    //   );
    // });

    // it("tests sidebar toggle event payload", () => {
    //   // Close the sidebar menu
    //   cy.get('button:has(svg[width="16"][height="16"][viewBox="0 0 16 16"])')
    //     .eq(1)
    //     .click();

    //   cy.validateGtmEvent(
    //     "toggle sidebar",
    //     gtmExpectedEvents.toggle_sidebar,
    //     consoleMessages
    //   );
    // });

    // it("tests insight_thumb_rating event payload", () => {
    //   cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
    //   cy.get(".cursor-pointer.bg-white").first().click();

    //   cy.validateGtmEvent(
    //     "insight_thumb_rating",
    //     gtmExpectedEvents.insight_thumb_rating,
    //     consoleMessages
    //   );
    // });

    // it("tests copy_button_click event payload", () => {
    //   cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
    //   cy.get(".cursor-pointer.bg-gray-60").first().click();

    //   cy.validateGtmEvent(
    //     "copy_button_click",
    //     gtmExpectedEvents.copy_button_click,
    //     consoleMessages
    //   );
    // });

    // it("tests drivers_tab_click event payload", () => {
    //   cy.visit("https://dev.violetgrowth.com/partners/qa/reports/drivers");
    //   cy.contains("Channel Type Drilldown", { timeout: 10000 }).click();

    //   cy.validateGtmEvent(
    //     "drivers_tab_click",
    //     gtmExpectedEvents.drivers_tab_click,
    //     consoleMessages
    //   );
    // });

    // it("tests open_help_menu_click event payload", () => {
    //   cy.contains("Help", { timeout: 10000 }).click();

    //   cy.validateGtmEvent(
    //     "open_help_menu_click",
    //     gtmExpectedEvents.open_help_menu_click,
    //     consoleMessages
    //   );
    // });

    // it("tests help_menu_item_click event payload", () => {
    //   cy.wait(3000);
    //   cy.contains("Help", { timeout: 10000 }).click();
    //   cy.wait(3000);
    //   cy.contains("Help Center", { timeout: 10000 }).click();
    //   cy.wait(3000);

    //   cy.validateGtmEvent(
    //     "help_menu_item_click",
    //     gtmExpectedEvents.help_menu_item_click,
    //     consoleMessages
    //   );
    // });

    // it("tests drawer_close_click event payload", () => {
    //   cy.contains("Help", { timeout: 10000 }).click();
    //   cy.contains("Help Center", { timeout: 10000 }).click();
    //   cy.get("button.bg-gray-150.w-7.h-7.rounded-full")
    //     .should("be.visible")
    //     .click({ force: true });

    //   cy.validateGtmEvent(
    //     "drawer_close_click",
    //     gtmExpectedEvents.drawer_close_click,
    //     consoleMessages
    //   );
    // });

    // it("tests internal_link_click event payload", () => {
    //   cy.contains("Help", { timeout: 10000 }).click();
    //   cy.contains("Help Center", { timeout: 10000 }).click();
    //   cy.contains("Comprehensive Example Article", { timeout: 10000 }).click();
    //   cy.contains("internal links to other articles", {
    //     timeout: 10000,
    //   }).click();

    //   cy.validateGtmEvent(
    //     "internal_link_click",
    //     gtmExpectedEvents.internal_link_click,
    //     consoleMessages
    //   );
    // });

    // it("tests external_link_click event payload", () => {
    //   cy.contains("Help", { timeout: 10000 }).click();
    //   cy.contains("Help Center", { timeout: 10000 }).click();
    //   cy.contains("Comprehensive Example Article", { timeout: 10000 }).click();
    //   cy.contains("contextual links to external sites", {
    //     timeout: 10000,
    //   }).click();

    //   cy.validateGtmEvent(
    //     "external_link_click",
    //     gtmExpectedEvents.external_link_click,
    //     consoleMessages
    //   );
    // });

    // it("tests help_menu_item_click_lexicon event payload", () => {
    //   cy.wait(3000);
    //   cy.contains("Help", { timeout: 10000 }).click();
    //   cy.wait(3000);
    //   cy.contains("Lexicon", { timeout: 10000 }).click();
    //   cy.wait(3000);

    //   cy.validateGtmEvent(
    //     "help_menu_item_click",
    //     gtmExpectedEvents.help_menu_item_click_lexicon,
    //     consoleMessages
    //   );
    // });
  });
});
