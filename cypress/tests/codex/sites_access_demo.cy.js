describe("Demo Public Availability (ui)", () => {
  // Persist logs even on failure so we can diagnose if needed
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

  it("shows Sign in with email on Dev (30s, with dynamic chunk pre-warm)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // 1) Pre-warm: fetch HTML, extract all Next.js JS/CSS (especially webpack/main), then cache them
    cy.request({ url, failOnStatusCode: false, timeout: 15000 }).then((res) => {
      const html = String(res.body || "");
      const jsMatches = [
        ...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g),
      ].map((m) => m[1]);
      const cssMatches = [
        ...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g),
      ].map((m) => m[1]);

      // Build absolute URLs, prioritize webpack then main first
      const abs = (p) => `https://${appHost}${p}`;
      const urls = Array.from(
        new Set([...jsMatches.map(abs), ...cssMatches.map(abs)])
      );

      urls.sort((a, b) => {
        const aw = a.includes("/chunks/webpack-")
          ? -2
          : a.includes("/chunks/main-")
          ? -1
          : 0;
        const bw = b.includes("/chunks/webpack-")
          ? -2
          : b.includes("/chunks/main-")
          ? -1
          : 0;
        return aw - bw;
      });

      // Warm each with a short timeout (keeps total under our 30s discipline)
      urls.forEach((u) => {
        cy.request({ url: u, failOnStatusCode: false, timeout: 15000 });
      });
    });

    // 2) Intercept: allow app HTML/Next static and backend; 204 everything else (incl. images/favicons)
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

        // Images/favicons (often stall load) → stub fast
        const isImagePath =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");

        if (isImagePath) return reply204();

        // Allow app HTML + Next static (js/css) and all backend API
        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        const isNextStatic = isApp && u.pathname.startsWith("/_next/static/");
        const isCss = isApp && u.pathname.endsWith(".css");

        if (isDoc || isNextStatic || isCss || isBackend) return pass();

        // Everything else → stub
        return reply204();
      } catch {
        return pass(); // conservative default
      }
    });

    // 3) Visit and assert (all waits capped at 30s)
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
