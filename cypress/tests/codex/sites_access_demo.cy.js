describe("Demo Public Availability (ui)", () => {
  // collectors live outside the test so afterEach can always see them
  let allowed = [];
  let stubbed = [];

  afterEach(() => {
    // always write a file, even if the test failed before assertions
    const text =
      "=== ALLOWED ===\n" +
      allowed.join("\n") +
      "\n\n=== STUBBED ===\n" +
      stubbed.join("\n");
    cy.writeFile("cypress/artifacts/network-log.txt", text, { log: false });
  });

  it("shows Sign in with email on Dev (capture network)", () => {
    const host = "dev.violetgrowth.com";
    const url = `https://${host}/login?from=/`;

    // reset collectors at the start of the test
    allowed = [];
    stubbed = [];

    // allowlist only your HTML + Next.js assets; stub everything else (fast 204)
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

    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch {}
      },
    });

    // 30s hard cap everywhere
    cy.get("#__next", { timeout: 30000 }).should("exist");

    cy.get("body").then(($b) => {
      if ($b.find(".animate-spin").length) {
        cy.log("Spinner detected - waiting up to 30s…");
        cy.get(".animate-spin", { timeout: 30000 }).should("not.exist");
      }
    });

    cy.window({ timeout: 30000 })
      .its("__NEXT_DATA__.page")
      .should("eq", "/login");

    cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  });
});
