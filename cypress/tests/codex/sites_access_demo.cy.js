// cypress/tests/codex/sites_access_demo.cy.js
describe("Demo Public Availability (ui)", () => {
  it("shows Sign in with email on Dev (capture network)", () => {
    const host = "dev.violetgrowth.com";
    const url = `https://${host}/login?from=/`;

    // --- Collectors ---
    const allowed = [];
    const stubbed = [];

    // --- Intercept and log everything ---
    cy.intercept({ url: "**", middleware: true }, (req) => {
      try {
        const u = new URL(req.url);
        const isSameHost = u.host === host;
        const isDoc =
          isSameHost &&
          (u.pathname === "/" ||
            u.pathname === "/login" ||
            u.pathname === "/login/");
        const isNextAsset = isSameHost && u.pathname.startsWith("/_next/");
        const isOk = isDoc || isNextAsset;

        if (isOk) {
          req.on("after:response", (res) => {
            allowed.push(`${res.statusCode} ${res.url}`);
          });
          req.continue();
        } else {
          stubbed.push(req.url);
          req.reply({ statusCode: 204, body: "" });
        }
      } catch {
        req.continue();
      }
    });

    // --- Visit ---
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
      },
    });

    cy.get("#__next", { timeout: 30000 }).should("exist");
    cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");

    // --- Save results for artifact ---
    cy.then(() => {
      const text =
        "=== ALLOWED ===\n" +
        allowed.join("\n") +
        "\n\n=== STUBBED ===\n" +
        stubbed.join("\n");
      cy.writeFile("cypress/artifacts/network-log.txt", text, { log: false });
    });
  });
});
