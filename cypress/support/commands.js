// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

Cypress.Commands.add("loginToVioletDev", () => {
  cy.visit("https://dev.violetgrowth.com/");

  // Click "Sign in with email"
  cy.contains("Sign in with email").click();

  // Enter email in the input labeled "Email Address", then click Continue
  cy.contains("Email Address")
    .parent()
    .find("input")
    .type("yotamjacob@walla.co.il");

  cy.contains("Continue", { timeout: 30000 }).click();

  // Enter password, then click Continue
  cy.get('input[type="password"]', { timeout: 30000 })
    .should("be.visible")
    .type("Eggrolls1246!");
  cy.contains("Sign In").click();

  cy.wait(2000);

  // Verify login success (adjust selector as needed)
  cy.url().should("not.include", "/login", { timeout: 20000 });
  cy.get("#__next", { timeout: 35000 }).should("exist");
  //switch to QA partner
  cy.get("svg.h-6.w-6", { timeout: 30000 })
    .should("be.visible")
    .click({ force: true });
  cy.contains("QA", { timeout: 30000 }).click();
  cy.wait(2000);
  cy.get("#__next", { timeout: 35000 }).should("exist");
  cy.url({ timeout: 35000 }).should("include", "/qa");
  cy.get("svg.h-6.w-6", { timeout: 35000 })
    .eq(0)
    .should("be.visible")
    .click({ force: true });
});

Cypress.Commands.add("clickVisibleThreeDots", () => {
  cy.get('button[class*="group-hover:block"]').each(($btn, index) => {
    cy.wrap($btn).then(($el) => {
      if ($el.is(":visible")) {
        Cypress.Promise.try(() => {
          return cy.wrap($el).click({ force: true });
        })
          .then(() => {
            cy.log(`Clicked 3-dots at index ${index}`);
          })
          .catch((err) => {
            cy.log(`Failed to click 3-dots at index ${index}: ${err.message}`);
          });
      } else {
        cy.log(`Skipping hidden 3-dots at index ${index}`);
      }
    });
  });
});

Cypress.Commands.add("createView", (name, options = {}) => {
  cy.contains("Views", { timeout: 40000 }).click();
  cy.contains("Save as New", { timeout: 40000 }).click();
  cy.get("#viewName", { includeShadowDom: true }).type(name);
  if (options.isDefault) cy.get("#isDefault").click();
  if (options.isPublic) cy.get("#isPublic").click();
  cy.get('button[type="submit"]').click();
  cy.contains("Your changes are saved.").should("be.visible");
  cy.contains(name, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("clickOnDeleteViewAndVerify", (name) => {
  cy.contains("Delete view", { timeout: 40000 }).click();
  cy.wait(4000);
  cy.contains("button", "Remove", { timeout: 45000 }).click();
  cy.wait(4000);
  cy.reload();
  cy.wait(4000);
});

Cypress.Commands.add(
  "validateGtmEvent",
  (eventName, expectedPayload, consoleMessages) => {
    cy.log(`Waiting for [GTM Event]: ${eventName}`);

    cy.wrap(null, { timeout: 15000 }).should(() => {
      const matchingEvents = consoleMessages.filter(
        (msg) => msg.data?.event === eventName
      );

      expect(
        matchingEvents.length,
        `should eventually have at least one matching ${eventName} event`
      ).to.be.greaterThan(0);
    });

    cy.wrap(null).then(() => {
      const matchingEvents = consoleMessages.filter(
        (msg) => msg.data?.event === eventName
      );

      const foundMatch = matchingEvents.some((event, eventIndex) => {
        console.log(`\nChecking event #${eventIndex + 1}:`, event.data);
        const allMatch = Object.entries(expectedPayload).every(
          ([key, value]) => {
            const actualValue = event.data?.[key];
            const isMatch = actualValue === value;
            console.log(
              `Compare key: "${key}" | expected: "${value}" | actual: "${actualValue}" | match: ${isMatch}`
            );
            return isMatch;
          }
        );
        console.log(`Result for event #${eventIndex + 1}: ${allMatch}\n`);
        return allMatch;
      });

      expect(
        foundMatch,
        `at least one ${eventName} event contains expected payload`
      ).to.be.true;
    });
  }
);
