// cypress/tests/codex/sites_access_demo.cy.js
describe("Demo Public Availability (ui)", () => {
  // Persist logs even on failure
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

  it("shows Sign in with email on Dev (fast 30s, warmed chunks)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // 1) Preflight: fetch HTML and extract critical chunk/css URLs, then pre-warm them via cy.request
    cy.request({ url, failOnStatusCode: false }).then((res) => {
      const html = String(res.body || "");
      const chunkRegex = /src="(\/_next\/static\/[^"]+\.js)"/g;
      const cssRegex = /href="(\/_next\/static\/[^"]+\.css)"/g;

      const urls = new Set();
      let m;
      while ((m = chunkRegex.exec(html))) urls.add(`https://${appHost}${m[1]}`);
      while ((m = cssRegex.exec(html))) urls.add(`https://${appHost}${m[1]}`);

      // Explicitly favor the webpack runtime if present
      [...urls].sort((a, b) => {
        const aw = a.includes("/chunks/webpack-") ? -1 : 0;
        const bw = b.includes("/chunks/webpack-") ? -1 : 0;
        return aw - bw;
      });

      // Warm each with a short request timeout so we don’t burn our 30s budget
      const warmOne = (u) =>
        cy.request({ url: u, failOnStatusCode: false, timeout: 15000 });

      [...urls].forEach(warmOne);
    });

    // 2) Intercept: allow our app + backend; stub everything else (including images/favicons)
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

        // images and favicons (often stall load) → 204 fast
        const isImagePath =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");

        if (isImagePath) return reply204();

        // Allow HTML + Next.js static assets (js/css) from app host, and all backend API
        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        const isNextStatic = isApp && u.pathname.startsWith("/_next/static/");
        const isCss = isApp && u.pathname.endsWith(".css");

        if (isDoc || isNextStatic || isCss || isBackend) return pass();

        // Everything else → 204
        return reply204();
      } catch {
        return pass();
      }
    });

    // 3) Visit and assert under 30s
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch {}
      },
    });

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
