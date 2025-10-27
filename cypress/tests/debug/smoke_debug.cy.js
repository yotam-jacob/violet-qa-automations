// cypress/tests/debug/smoke_debug.cy.js

describe("CI Smoke Debug", () => {
  it("Loads raw HTML and reports what it got", () => {
    const targetUrl = "https://staging.violetgrowth.com/login?from=/";

    // 1. Low-level request: is the server giving us HTML?
    cy.request({
      url: targetUrl,
      failOnStatusCode: false, // don't crash even if 403/500/etc
      timeout: 120000,
    }).then((resp) => {
      cy.log("STATUS: " + resp.status);
      cy.log("HEADERS: " + JSON.stringify(resp.headers).slice(0, 1000));
      cy.log("BODY START: " + resp.body.slice(0, 2000));
      // Sanity assert so test actually "fails" if it's total garbage
      expect(resp.status).to.be.oneOf([200, 302, 307, 308]);
    });

    // 2. Now open in actual browser context
    cy.visit(targetUrl, {
      timeout: 120000,
      onBeforeLoad(win) {
        // dump some navigator info to detect bot/blocked mode
        win.__CYP_DEBUG = {
          ua: win.navigator.userAgent,
          lang: win.navigator.language,
        };
      },
    });

    cy.screenshot("after-visit-attempt");

    // 3. After load, dump what Cypress *actually sees*
    cy.window({ timeout: 30000 }).then((win) => {
      cy.log("USER AGENT: " + win.__CYP_DEBUG.ua);
      cy.log("LANG: " + win.__CYP_DEBUG.lang);
    });

    cy.url({ timeout: 30000 }).then((u) => {
      cy.log("FINAL URL: " + u);
    });

    cy.document({ timeout: 30000 }).then((doc) => {
      const htmlSnippet = doc.documentElement.innerHTML.slice(0, 3000);
      cy.log("FINAL HTML START: " + htmlSnippet);
      // try to confirm page is "alive":
      expect(htmlSnippet.length).to.be.greaterThan(100);
    });

    cy.screenshot("after-document-resolved");

    // 4. Look specifically for Next.js / React root element
    cy.get("body", { timeout: 30000 }).should("exist");
  });
});
