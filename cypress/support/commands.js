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
  // const url = "https://staging.violetgrowth.com/";

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

  // cy.visit(url, { failOnStatusCode: false });

  cy.contains("Sign in with email", { timeout: 55000 }).click();

  cy.contains("Email Address")
    .parent()
    .find("input")
    .type("yotamjacob@walla.co.il");

  cy.contains("Continue", { timeout: 30000 }).click();

  cy.get('input[type="password"]', { timeout: 30000 })
    .should("be.visible")
    .type("Eggrolls1246!");
  // cy.wait(1000);

  cy.contains("Sign In", { timeout: 40000 }).click();
  // cy.wait(3000);

  // cy.get("#__next", { timeout: 35000 }).should("exist");

  // cy.url().should("not.include", "/login", { timeout: 40000 });

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
  // cy.wait(1000);

  cy.contains("Sign In").click();
  // cy.wait(3000);

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
  // cy.wait(1000);
  cy.contains("Views", { timeout: 30000 }).click();
  cy.contains("Save as New", { timeout: 40000 }).click();
  cy.get("#viewName", { includeShadowDom: true }).type(name);
  if (options.isDefault) cy.get("#isDefault", { timeout: 10000 }).click();
  if (options.isPublic) cy.get("#isPublic", { timeout: 10000 }).click();
  // cy.wait(1000);

  cy.get('button[type="submit"]', { timeout: 20000 }).click();
  // cy.wait(1000);
  cy.contains('"' + name + '"' + " saved successfully!", {
    timeout: 20000,
  }).should("be.visible");

  // cy.wait(1000);

  cy.contains(name, { timeout: 10000 }).should("be.visible");
  // cy.wait(1000);

  //wait for the snackbar saying 'saved successfully!' to dissappear by making sure it's not visible
  cy.contains('"' + name + '"' + " saved successfully!").should("not.exist", { timeout: 10000 });
});

Cypress.Commands.add("clickOnDeleteViewAndVerify", (name) => {
  cy.contains("Delete view", { timeout: 40000 }).click();
  // cy.wait(3000);
  cy.contains("button", "Remove", { timeout: 45000 }).click();
  // cy.wait(3000);
  //verify the view is deleted by asserting snackbar with text 'Successfully deleted!' is visible
  cy.contains("Successfully deleted!", { timeout: 20000 }).should("be.visible");
  // cy.wait(3000);
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

const suffixMatch = (host, pattern) => {
  if (!pattern) return false;
  if (pattern.startsWith("*.")) {
    const base = pattern.slice(2);
    return host === base || host.endsWith(`.${base}`);
  }
  return host === pattern;
};

Cypress.Commands.add("cdnVisit", (pathOrUrl, options = {}) => {
  const appHost = Cypress.env("APP_HOST");
  const backendHost = Cypress.env("BACKEND_HOST");
  const staticHost = Cypress.env("STATIC_HOST") || appHost;
  const extraAllow = (Cypress.env("EXTRA_ALLOW_HOSTS") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!appHost) throw new Error("CYPRESS_APP_HOST not set");

  const toAbs = (u) =>
    typeof u === "string" && /^https?:\/\//i.test(u)
      ? u
      : `https://${appHost}${String(u).startsWith("/") ? "" : "/"}${u}`;

  const pageUrl = toAbs(pathOrUrl);
  const cache = {}; // absolute-url -> { statusCode, headers, body }

  // 1) Discover Next.js static assets (absolute & relative)
  cy.request({ url: pageUrl, failOnStatusCode: false, timeout: 45000 }).then(
    (res) => {
      const html = String(res.body || "");
      const srcHrefs = [
        ...html.matchAll(/<script[^>]+src="([^"]+)"/gi),
        ...html.matchAll(/<link[^>]+href="([^"]+)"/gi),
      ]
        .map((m) => m[1])
        .filter(Boolean)
        .map((u) => {
          try {
            return new URL(u, `https://${appHost}`).toString();
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const assets = Array.from(
        new Set(
          srcHrefs.filter((u) => {
            try {
              const url = new URL(u);
              return (
                url.pathname.startsWith("/_next/static/") &&
                (url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))
              );
            } catch {
              return false;
            }
          })
        )
      );

      assets.sort((a, b) => {
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
        cy.request({ url: u, failOnStatusCode: false, timeout: 45000 }).then(
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
        const isStatic =
          u.host === staticHost && u.pathname.startsWith("/_next/static/");
        const isExtraAllowed = extraAllow.some((p) => suffixMatch(u.host, p));

        // Serve Next static js/css from cache (works if STATIC_HOST != APP_HOST)
        if (isStatic) {
          const key = req.url;
          if (cache[key]) return req.reply(cache[key]);
          return req.continue();
        }

        // Always allow backend API
        if (isBackend) return req.continue();

        // Allow extra allowed hosts fully (incl. images/css/js) — e.g., Tableau, image CDN
        if (isExtraAllowed) return req.continue();

        // Keep load fast: stub images/favicons ONLY if the host is not app or extra-allowed
        const isImg =
          /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");

        if (isImg && !isApp) {
          // allow images from extra-allowed hosts; stub others
          if (!isExtraAllowed) return req.reply({ statusCode: 204, body: "" });
          return req.continue();
        }

        // Allow app HTML/resources; stub other externals
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
