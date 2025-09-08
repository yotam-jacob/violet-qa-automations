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
    it("tests copy_button_click event payload", () => {
      cy.visit("https://dev.violetgrowth.com/partners/qa/reports/insights");
      cy.wait(3000);
      cy.get(".cursor-pointer.bg-gray-60").first().click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "copy_button_click",
        gtmExpectedEvents.copy_button_click,
        consoleMessages
      );
    });

    it("tests drivers_tab_click event payload", () => {
      cy.visit("https://dev.violetgrowth.com/partners/qa/reports/drivers");
      cy.contains("Drivers Tab", { timeout: 20000 }).click();

      cy.validateGtmEvent(
        "drivers_tab_click",
        gtmExpectedEvents.drivers_tab_click,
        consoleMessages
      );
    });

    it("tests open_help_menu_click event payload", () => {
      cy.contains("Help", { timeout: 10000 }).click();

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
      cy.wait(3000);
      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.get('svg[aria-hidden="true"][viewBox="0 0 20 20"]')
        .should("exist")
        .parents("button")
        .first()
        .should("be.visible")
        .click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "drawer_close_click",
        gtmExpectedEvents.drawer_close_click,
        consoleMessages
      );
    });

    it("tests internal_link_click event payload", () => {
      cy.wait(3000);
      cy.contains("Help", { timeout: 20000 }).click();
      cy.wait(3000);

      cy.contains("Help Center", { timeout: 20000 }).click();
      cy.wait(3000);

      cy.contains("Dashboards Overview", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Comprehensive Example Article", { timeout: 20000 }).click({
        force: true,
      });
      cy.wait(3000);

      cy.contains("internal links to other articles", {
        timeout: 20000,
      }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "internal_link_click",
        gtmExpectedEvents.internal_link_click,
        consoleMessages
      );
    });

    it("tests external_link_click event payload", () => {
      cy.contains("Help", { timeout: 30000 }).click();
      cy.wait(3000);

      cy.contains("Help Center", { timeout: 30000 }).click();
      cy.wait(3000);

      cy.contains("Dashboards Overview", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Comprehensive Example Article", { timeout: 30000 }).click({
        force: true,
      });
      cy.wait(3000);

      cy.contains("contextual links to external sites", {
        timeout: 30000,
      }).click();

      cy.validateGtmEvent(
        "external_link_click",
        gtmExpectedEvents.external_link_click,
        consoleMessages
      );
    });

    it("tests help_menu_item_click_lexicon event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.contains("Lexicon", { timeout: 40000 }).click();

      cy.validateGtmEvent(
        "help_menu_item_click",
        gtmExpectedEvents.help_menu_item_click_lexicon,
        consoleMessages
      );
    });

    it("tests save_view_modal_clicks_save event payload", () => {
      //Create new view
      cy.createView(AUTOMATION_VIEW_NAME);

      //Verify the view is renamed
      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();

      //Delete the view
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();

      cy.clickVisibleThreeDots();
      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "save view modal clicks",
        gtmExpectedEvents.save_view_modal_clicks_save,
        consoleMessages
      );
    });

    it("tests contact_support_modal_close event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.contains("Contact Support", { timeout: 40000 }).click();
      cy.get('button[title="close"]', { timeout: 40000 }).click();

      cy.validateGtmEvent(
        "contact_support_modal_close",
        gtmExpectedEvents.contact_support_modal_close,
        consoleMessages
      );
    });

    it("tests article_list_lexicon_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.contains("Lexicon", { timeout: 40000 }).click();

      cy.validateGtmEvent(
        "article_list_lexicon_click",
        gtmExpectedEvents.article_list_lexicon_click,
        consoleMessages
      );
    });

    it("tests expand_collection_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.wait(3000);
      cy.contains("Lexicon", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Table of Raw Metrics", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "expand_collection_click",
        gtmExpectedEvents.expand_collection_click,
        consoleMessages
      );
    });

    it("tests expand_term_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Lexicon", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Table of Raw Metrics", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Clicks", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "expand_term_click",
        gtmExpectedEvents.expand_term_click,
        consoleMessages
      );
    });

    it("tests category_article_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Dashboards Overview", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Comprehensive Example Article", { timeout: 40000 }).click({
        force: true,
      });
      cy.wait(3000);

      cy.validateGtmEvent(
        "category_article_click",
        gtmExpectedEvents.category_article_click,
        consoleMessages
      );
    });

    it("tests category_click event payload", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Help Center", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("Dashboards Overview", { timeout: 40000 }).click();
      cy.wait(3000);

      cy.validateGtmEvent(
        "category_click",
        gtmExpectedEvents.category_click,
        consoleMessages
      );
    });

    it("tests remove_view_modal_click_cancel event payload", () => {
      //Create new view
      cy.createView(AUTOMATION_VIEW_NAME);

      //Cancel the view
      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();
      cy.wait(3000);
      cy.clickVisibleThreeDots();
      cy.wait(3000);

      cy.contains("Delete view", { timeout: 40000 }).click();
      cy.wait(1000);
      cy.contains("button:visible", "Cancel", { timeout: 15000 }).click({
        scrollBehavior: "center",
      });

      cy.wait(3000);
      cy.contains("div.w-full", AUTOMATION_VIEW_NAME).realHover();
      cy.wait(3000);
      cy.clickVisibleThreeDots();
      cy.wait(3000);
      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "remove_view_modal_click_cancel",
        gtmExpectedEvents.remove_view_modal_click_cancel,
        consoleMessages
      );
    });

    it("tests remove_view_modal_click_remove event payload", () => {
      //Create new view
      cy.createView(AUTOMATION_VIEW_NAME, { isPublic: true });
      cy.wait(3000); //necessary for elements loading

      cy.contains(AUTOMATION_VIEW_NAME, { timeout: 40000 }).click();
      cy.wait(3000);

      cy.contains("div.w-full", AUTOMATION_VIEW_NAME)
        .find("div.group\\/item.relative")
        .realHover();

      cy.wait(3000); //necessary for elements loading

      cy.clickVisibleThreeDots();
      cy.wait(3000); //necessary for elements loading

      cy.clickOnDeleteViewAndVerify();

      cy.validateGtmEvent(
        "remove_view_modal_click_remove",
        gtmExpectedEvents.remove_view_modal_click_remove,
        consoleMessages
      );
    });
  });
});
