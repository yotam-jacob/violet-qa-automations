// cypress/tests/codex/sites_access_demo.cy.js
describe("Demo Public Availability (ui)", () => {
  // persistent logs even on failure
  let started = [];
  let allowed = [];
  let stubbed = [];

  afterEach(() => {
    const text =
      "=== STARTED ===\n" +
      started.join("\n") +
      "\n\n=== ALLOWED ===\n" +
      allowed.join("\n") +
      "\n\n=== STUBBED ===\n" +
      stubbed.join("\n");
    cy.writeFile("cypress/artifacts/network-log.txt", text, { log: false });
  });

  it("shows Sign in with email on Dev (fast 30s)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // Allow only: app HTML, Next.js JS/CSS, backend API.
    // Stub quickly: EVERYTHING else, including all images (same-host and external).
    cy.intercept({ url: "**", middleware: true }, (req) => {
      started.push(req.url);

      const reply204 = () => {
        stubbed.push(req.url);
        req.reply({ statusCode: 204, body: "" });
      };
      const pass = () => {
        req.on("after:response", (res) => {
          allowed.push(`${res.statusCode} ${res.url}`);
        });
        req.continue();
      };

      try {
        const u = new URL(req.url);
        const isApp = u.host === appHost;
        const isBackend = u.host === backendHost;

        // block images/favicons everywhere (these often stall load)
        const isImagePath =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image"); // Next optimizer

        if (isImagePath) return reply204();

        // allow HTML doc and any Next.js static assets (js/css) from app host
        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        const isNextStatic = isApp && u.pathname.startsWith("/_next/static/");
        const isCss = isApp && u.pathname.endsWith(".css");

        // allow backend API
        if (isDoc || isNextStatic || isCss || isBackend) return pass();

        // everything else → fast 204
        return reply204();
      } catch {
        return pass(); // be conservative if URL parsing fails
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

    // 30s hard caps everywhere
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
