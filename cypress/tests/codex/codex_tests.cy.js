describe("Codex Quality Baseline", () => {
  const BASE_URL = "https://staging.violetgrowth.com";
  const KPI_TRENDLINES_URL = `${BASE_URL}/partners/qa/reports/kpi-trendlines`;

  const performLogout = () => {
    cy.get("#logout-modal", { timeout: 20000 }).check({ force: true });
    cy.get("button.btn.btn-primary.text-white")
      .contains("Logout", { timeout: 20000 })
      .should("be.visible")
      .click();
    cy.contains("Growth Starts Here", { timeout: 40000 }).should("be.visible");
  };

  context("Authentication & Session Security", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it("requires authentication for partner dashboards", () => {
      cy.visit(KPI_TRENDLINES_URL, { failOnStatusCode: false });
      cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
    });

    it("invalidates the session after logout", () => {
      cy.loginToVioletStg();
      cy.url({ timeout: 40000 }).should("include", "/partners/qa");

      performLogout();

      cy.visit(KPI_TRENDLINES_URL, { failOnStatusCode: false });
      cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
    });

    it("avoids loading insecure asset URLs", () => {
      cy.loginToVioletStg();
      cy.get("#__next", { timeout: 45000 }).should("exist");

      cy.document().then((doc) => {
        const insecureAssets = Array.from(
          doc.querySelectorAll("script[src], img[src], link[href], iframe[src]")
        ).filter((node) => {
          const url = node.getAttribute("src") || node.getAttribute("href");
          return url && /^http:\/\//i.test(url) && !url.startsWith("http://localhost");
        });

        expect(
          insecureAssets,
          "insecure (http) assets should not be requested"
        ).to.be.empty;
      });

      performLogout();
    });
  });

  context("Navigation & Accessibility", () => {
    beforeEach(() => {
      cy.loginToVioletStg();
      cy.get("#__next", { timeout: 45000 }).should("exist");
    });

    afterEach(() => {
      performLogout();
    });

    it("keeps user assistance reachable from the help menu", () => {
      cy.contains("Help", { timeout: 40000 }).click();
      cy.contains("Help Center", { timeout: 40000 }).should("be.visible");
      cy.contains("Contact Support", { timeout: 40000 }).should("be.visible");

      cy.contains("Contact Support", { timeout: 40000 }).click();
      cy.get('button[title="close"]', { timeout: 40000 })
        .should("be.visible")
        .click();
      cy.contains("Help", { timeout: 40000 }).should("be.visible");
    });
  });

  context("Performance Signals", () => {
    beforeEach(() => {
      cy.loginToVioletStg();
      cy.get("#__next", { timeout: 45000 }).should("exist");
    });

    afterEach(() => {
      performLogout();
    });

    it("keeps initial load time within acceptable bounds", () => {
      cy.window().then((win) => {
        const navigationEntries = win.performance.getEntriesByType("navigation");
        const latestEntry = navigationEntries[navigationEntries.length - 1];

        expect(latestEntry, "navigation timing entry").to.exist;

        const loadDuration = latestEntry.loadEventEnd - latestEntry.startTime;
        cy.log(`Initial load duration: ${Math.round(loadDuration)}ms`);
        expect(loadDuration, "initial load time (ms)").to.be.lessThan(20000);
      });
    });
  });
});
