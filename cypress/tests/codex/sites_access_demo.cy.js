// cypress/tests/codex/sites_access_demo.cy.js
describe("Demo Public Availability (ui)", () => {
  it("shows Sign in with email on Dev", () => {
    const url = "https://dev.violetgrowth.com/login?from=/";

    // ── Block heavy third-party requests so load() fires quickly ──
    cy.intercept("GET", "https://fonts.googleapis.com/**", {
      statusCode: 204,
      body: "",
    });
    cy.intercept("GET", "https://fonts.gstatic.com/**", {
      statusCode: 204,
      body: "",
    });
    cy.intercept("GET", "https://public.tableau.com/javascripts/api/**", {
      statusCode: 204,
      body: "",
    });
    cy.intercept(
      "GET",
      "https://app-cdn.clickup.com/assets/js/forms-embed/**",
      { statusCode: 204, body: "" }
    );
    cy.intercept("GET", "https://www.googletagmanager.com/**", {
      statusCode: 204,
      body: "",
    });
    cy.intercept("GET", "https://www.google-analytics.com/**", {
      statusCode: 204,
      body: "",
    });

    // ── Visit and assert ──
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch (_) {}
      },
    });

    // Quick 30-second waits max
    cy.get("#__next", { timeout: 30000 }).should("exist");

    cy.get("body").then(($b) => {
      if ($b.find(".animate-spin").length) {
        cy.log("Spinner detected - waiting up to 30s to disappear…");
        cy.get(".animate-spin", { timeout: 30000 }).should("not.exist");
      }
    });

    cy.window({ timeout: 30000 })
      .its("__NEXT_DATA__.page")
      .should("eq", "/login");

    cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  });
});
