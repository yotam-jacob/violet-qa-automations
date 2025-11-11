describe("Demo Public Availability (ui)", () => {
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

  it("shows Sign in with email on Dev (45s timeout with pre-warm)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // 1) Pre-warm all critical Next.js chunks before real visit
    cy.request({ url, failOnStatusCode: false, timeout: 20000 }).then((res) => {
      const html = String(res.body || "");
      const jsMatches = [
        ...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g),
      ].map((m) => m[1]);
      const cssMatches = [
        ...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g),
      ].map((m) => m[1]);
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

      urls.forEach((u) => {
        cy.request({ url: u, failOnStatusCode: false, timeout: 20000 });
      });
    });

    // 2) Intercept: allow app + backend, stub everything else fast
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

        const isImagePath =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");

        if (isImagePath) return reply204();

        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        const isNextStatic = isApp && u.pathname.startsWith("/_next/static/");
        const isCss = isApp && u.pathname.endsWith(".css");

        if (isDoc || isNextStatic || isCss || isBackend) return pass();

        return reply204();
      } catch {
        return pass();
      }
    });

    // 3) Visit and assert with 45 s cap
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch {}
      },
    });

    cy.get("#__next", { timeout: 45000 }).should("exist");

    cy.get("body").then(($b) => {
      if ($b.find(".animate-spin").length) {
        cy.log("Spinner detected – waiting up to 45 s…");
        cy.get(".animate-spin", { timeout: 45000 }).should("not.exist");
      }
    });

    cy.window({ timeout: 45000 })
      .its("__NEXT_DATA__.page")
      .should("eq", "/login");

    cy.contains("Sign in with email", { timeout: 45000 }).should("be.visible");
  });
});
