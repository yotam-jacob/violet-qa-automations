describe("Demo Public Availability (ui)", () => {
  // persist logs even on failure
  let allowed = [];
  let stubbed = [];

  afterEach(() => {
    const text =
      "=== ALLOWED ===\n" +
      allowed.join("\n") +
      "\n\n=== STUBBED ===\n" +
      stubbed.join("\n");
    cy.writeFile("cypress/artifacts/network-log.txt", text, { log: false });
  });

  it("shows Sign in with email on Dev (fast 30s)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // Allow only our app HTML/Next.js assets and backend API. Stub everything else to 204.
    cy.intercept({ url: "**", middleware: true }, (req) => {
      try {
        const u = new URL(req.url);
        const isApp = u.host === appHost;
        const isBackend = u.host === backendHost;
        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        const isNextAsset = isApp && u.pathname.startsWith("/_next/");
        const passThrough = isDoc || isNextAsset || isBackend;

        if (passThrough) {
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

    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch {}
      },
    });

    // root exists
    cy.get("#__next", { timeout: 30000 }).should("exist");

    // spinner (if present) disappears within 30s
    cy.get("body").then(($b) => {
      if ($b.find(".animate-spin").length) {
        cy.log("Spinner detected - waiting up to 30s…");
        cy.get(".animate-spin", { timeout: 30000 }).should("not.exist");
      }
    });

    // confirm Next.js routed to /login and then assert the UI
    cy.window({ timeout: 30000 })
      .its("__NEXT_DATA__.page")
      .should("eq", "/login");
    cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  });
});
