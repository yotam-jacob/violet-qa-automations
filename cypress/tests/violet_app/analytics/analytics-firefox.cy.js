import { gtmExpectedEvents } from "/cypress/fixtures/gtmEventsPayloads.js";
import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("analytics Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletStg();
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
    it("tests report_click event payload", () => {
      cy.wait(1000); // Wait for the GTM script to load

      cy.visit(
        "https://staging.violetgrowth.com/partners/qa/reports/kpi-trendlines"
      );
      cy.wait(1000); // Wait for the GTM script to load

      cy.contains("KPI Trendlines", { timeout: 40000 }).click();
      cy.wait(1000); // Wait for the GTM script to load

      cy.validateGtmEvent(
        "report_click",
        gtmExpectedEvents.report_click,
        consoleMessages
      );
    });

    it("tests report_load event payload", () => {
      cy.contains("KPI Trendlines", { timeout: 40000 }).click();
      cy.wait(1000);
      cy.validateGtmEvent(
        "report_load",
        gtmExpectedEvents.report_load,
        consoleMessages
      );
    });

    it("tests actions_menu_click event payload", () => {
      cy.wait(1000);
      cy.contains("Views", { timeout: 40000 }).click();
      cy.wait(1000);

      cy.validateGtmEvent(
        "actions_menu_click",
        gtmExpectedEvents.actions_menu_click,
        consoleMessages
      );
    });

    it("tests views_menu_click_reset event payload", () => {
      cy.contains("Views", { timeout: 40000 }).click();
      cy.contains("Reset", { timeout: 40000 }).click();
      cy.validateGtmEvent(
        "views_menu_click",
        gtmExpectedEvents.views_menu_click_reset,
        consoleMessages
      );
    });

    it("tests download_menu_click event payload", () => {
      //Open download modal

      cy.get(
        "button.flex.gap-2.rounded-full.p-2.text-main-primaryPurple.justify-center.items-center.bg-main-primaryLightGrey",
        { timeout: 40000 }
      )
        .eq(1)
        .should("be.visible")
        .click();

      cy.contains("PDF").click();

      cy.validateGtmEvent(
        "download_menu_click",
        gtmExpectedEvents.download_menu_click,
        consoleMessages
      );
    });

    it("tests filter_picked event payload", () => {
      cy.visit("https://staging.violetgrowth.com/partners/qa/reports/insights");

      cy.contains("button", "PopSells", { timeout: 20000 }).click();
      cy.contains("PopSells2", { timeout: 40000 }).click();

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

    it("tests sidebar toggle event payload", () => {
      // Close the sidebar menu
      cy.wait(1000);
      cy.get('button:has(svg[width="16"][height="16"][viewBox="0 0 16 16"])')
        .eq(1)
        .click();
      cy.wait(1000);

      cy.validateGtmEvent(
        "toggle sidebar",
        gtmExpectedEvents.toggle_sidebar,
        consoleMessages
      );
    });

    it("tests insight_thumb_rating event payload", () => {
      cy.visit("https://staging.violetgrowth.com/partners/qa/reports/insights");
      cy.wait(1000);
      cy.get(".cursor-pointer.bg-white").first().click();
      cy.wait(1000);

      cy.validateGtmEvent(
        "insight_thumb_rating",
        gtmExpectedEvents.insight_thumb_rating,
        consoleMessages
      );
    });

    it("tests copy_button_click event payload", () => {
      cy.visit("https://staging.violetgrowth.com/partners/qa/reports/insights");
      cy.get(".cursor-pointer.bg-gray-60", { timeout: 40000 }).first().click();

      cy.validateGtmEvent(
        "copy_button_click",
        gtmExpectedEvents.copy_button_click,
        consoleMessages
      );
    });

    it("tests drivers_tab_click event payload", () => {
      cy.visit("https://staging.violetgrowth.com/partners/qa/reports/drivers");
      cy.contains("Drivers Tab", { timeout: 20000 }).click();

      cy.validateGtmEvent(
        "drivers_tab_click",
        gtmExpectedEvents.drivers_tab_click,
        consoleMessages
      );
    });

    it("tests open_help_menu_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();

      cy.validateGtmEvent(
        "open_help_menu_click",
        gtmExpectedEvents.open_help_menu_click,
        consoleMessages
      );
    });

    it("tests help_menu_item_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.validateGtmEvent(
        "help_menu_item_click",
        gtmExpectedEvents.help_menu_item_click,
        consoleMessages
      );
    });

    it("tests drawer_close_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.wait(1000);
      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.wait(1000);

      cy.get('svg[aria-hidden="true"][viewBox="0 0 20 20"]')
        .should("exist")
        .parents("button")
        .first()
        .should("be.visible")
        .click();

      cy.wait(1000);

      cy.validateGtmEvent(
        "drawer_close_click",
        gtmExpectedEvents.drawer_close_click,
        consoleMessages
      );
    });
  });
});
