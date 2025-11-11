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

Cypress.Commands.add("loginToVioletStg", () => {
  const url = "https://staging.violetgrowth.com/";

  // Suppress specific known error from your app
  Cypress.on("uncaught:exception", (err) => {
    if (
      err.message.includes(
        "Invariant: attempted to hard navigate to the same URL"
      )
    ) {
      return false;
    }
  });

  cy.visit(url, { failOnStatusCode: false });

  cy.contains("Sign in with email", { timeout: 55000 }).click();

  cy.contains("Email Address")
    .parent()
    .find("input")
    .type("yotamjacob@walla.co.il");

  cy.contains("Continue", { timeout: 30000 }).click();

  cy.get('input[type="password"]', { timeout: 30000 })
    .should("be.visible")
    .type("Eggrolls1246!");
  cy.wait(1000);

  cy.contains("Sign In").click();
  cy.wait(3000);

  cy.url().should("not.include", "/login", { timeout: 40000 });
  cy.get("#__next", { timeout: 35000 }).should("exist");

  cy.url({ timeout: 65000 }).should("include", "/qa");

  cy.contains("KPI Trendlines", { timeout: 90000 }).click();
});

Cypress.Commands.add("loginToVioletDev", () => {
  const url = "https://dev.violetgrowth.com/";

  // Suppress specific known error from your app
  Cypress.on("uncaught:exception", (err) => {
    if (
      err.message.includes(
        "Invariant: attempted to hard navigate to the same URL"
      )
    ) {
      return false;
    }
  });

  cy.visit(url, { failOnStatusCode: false });

  cy.contains("Sign in with email", { timeout: 15000 }).click();

  cy.contains("Email Address")
    .parent()
    .find("input")
    .type("yotamjacob@walla.co.il");

  cy.contains("Continue", { timeout: 30000 }).click();

  cy.get('input[type="password"]', { timeout: 30000 })
    .should("be.visible")
    .type("Eggrolls1246!");
  cy.wait(1000);

  cy.contains("Sign In").click();
  cy.wait(3000);

  cy.url().should("not.include", "/login", { timeout: 40000 });
  cy.get("#__next", { timeout: 35000 }).should("exist");

  cy.url({ timeout: 65000 }).should("include", "/qa");

  cy.contains("KPI Trendlines", { timeout: 90000 }).click();
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
  cy.wait(1000);
  cy.contains("Views", { timeout: 20000 }).click();
  cy.contains("Save as New", { timeout: 40000 }).click();
  cy.get("#viewName", { includeShadowDom: true }).type(name);
  if (options.isDefault) cy.get("#isDefault", { timeout: 10000 }).click();
  if (options.isPublic) cy.get("#isPublic", { timeout: 10000 }).click();
  cy.wait(1000);

  cy.get('button[type="submit"]', { timeout: 20000 }).click();
  cy.wait(1000);
  cy.contains('"' + name + '"' + " saved successfully!", {
    timeout: 20000,
  }).should("be.visible");

  cy.wait(1000);

  cy.contains(name, { timeout: 10000 }).should("be.visible");
  cy.wait(1000);
});

Cypress.Commands.add("clickOnDeleteViewAndVerify", (name) => {
  cy.contains("Delete view", { timeout: 40000 }).click();
  cy.wait(3000);
  cy.contains("button", "Remove", { timeout: 45000 }).click();
  cy.wait(3000);
  cy.reload();
  cy.wait(3000);
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

Cypress.Commands.add("cdnVisit", (pathOrUrl, options = {}) => {
  const appHost = Cypress.env("APP_HOST"); // e.g. dev.violetgrowth.com
  const backendHost = Cypress.env("BACKEND_HOST"); // e.g. dev.api.violetgrowth.com

  if (!appHost) throw new Error("CYPRESS_APP_HOST not set");

  const toAbs = (u) =>
    typeof u === "string" && u.startsWith("http")
      ? u
      : `https://${appHost}${String(u).startsWith("/") ? "" : "/"}${u}`;

  const pageUrl = toAbs(pathOrUrl);
  const cache = {}; // url -> { statusCode, headers, body }

  // 1) Discover Next.js static assets for this page
  cy.request({ url: pageUrl, failOnStatusCode: false, timeout: 20000 }).then(
    (res) => {
      const html = String(res.body || "");
      const js = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map(
        (m) => m[1]
      );
      const css = [
        ...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g),
      ].map((m) => m[1]);
      const abs = (p) => `https://${appHost}${p}`;
      const assets = Array.from(
        new Set([...js.map(abs), ...css.map(abs)])
      ).sort((a, b) => {
        const rank = (u) =>
          u.includes("/chunks/webpack-")
            ? -2
            : u.includes("/chunks/main-")
            ? -1
            : 0;
        return rank(a) - rank(b);
      });

      // 2) Prefetch and cache those assets
      assets.forEach((u) => {
        cy.request({ url: u, failOnStatusCode: false, timeout: 20000 }).then(
          (r) => {
            const type = u.endsWith(".css")
              ? "text/css; charset=utf-8"
              : "application/javascript; charset=utf-8";
            cache[u] = {
              statusCode: r.status,
              headers: { "content-type": type },
              body: r.body,
            };
          }
        );
      });
    }
  );

  // 3) Intercepts for the real visit
  cy.then(() => {
    cy.intercept({ url: "**", middleware: true }, (req) => {
      try {
        const u = new URL(req.url);
        const isApp = u.host === appHost;
        const isBackend = backendHost && u.host === backendHost;

        // Serve Next.js static js/css from our cache
        if (isApp && u.pathname.startsWith("/_next/static/")) {
          if (cache[req.url]) return req.reply(cache[req.url]);
          return req.continue();
        }

        // Allow backend API
        if (isBackend) return req.continue();

        // Keep load fast: block images and favicons anywhere
        const isImg =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");
        if (isImg) return req.reply({ statusCode: 204, body: "" });

        // Allow app HTML/resources; stub everything else (externals)
        if (isApp) return req.continue();
        return req.reply({ statusCode: 204, body: "" });
      } catch {
        return req.continue();
      }
    });
  });

  // 4) Real visit
  return cy.visit(pageUrl, {
    failOnStatusCode: false,
    ...options,
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, "webdriver", { get: () => false });
      if (typeof options.onBeforeLoad === "function") options.onBeforeLoad(win);
    },
  });
});
