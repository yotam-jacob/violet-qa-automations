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

  it("shows Sign in with email on Dev (45s, CDN-proofed)", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // --- 1) Discover critical Next.js assets from HTML
    const nextAssets = [];
    cy.request({ url, failOnStatusCode: false, timeout: 20000 }).then((res) => {
      const html = String(res.body || "");
      const js = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map(
        (m) => m[1]
      );
      const css = [
        ...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g),
      ].map((m) => m[1]);
      const abs = (p) => `https://${appHost}${p}`;
      const all = Array.from(new Set([...js.map(abs), ...css.map(abs)]));

      // Prioritize webpack and main first
      all.sort((a, b) => {
        const score = (u) =>
          u.includes("/chunks/webpack-")
            ? -2
            : u.includes("/chunks/main-")
            ? -1
            : 0;
        return score(a) - score(b);
      });

      nextAssets.push(...all);
    });

    // --- 2) Fetch those assets now and hold in an in-memory cache for reply()
    const cache = {}; // { url: { statusCode, headers, body } }
    cy.then(() => {
      // chain sequentially so Cypress waits for each
      nextAssets.forEach((u) => {
        cy.request({ url: u, failOnStatusCode: false, timeout: 20000 }).then(
          (r) => {
            // minimal safe headers
            const type = u.endsWith(".css")
              ? "text/css; charset=utf-8"
              : "application/javascript; charset=utf-8";
            cache[u] = {
              statusCode: r.status,
              headers: { "content-type": type },
              body: r.body,
            };
          }
        );
      });
    });

    // --- 3) Intercept: serve Next.js static js/css from our cache; allow backend; stub the rest
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

        // Serve Next static js/css from cache if present
        const isNextStatic = isApp && u.pathname.startsWith("/_next/static/");
        if (isNextStatic) {
          const key = req.url; // absolute URL
          if (cache[key]) {
            allowed.push(`CACHE ${key}`);
            return req.reply(cache[key]);
          }
          // if somehow missing, allow through
          return pass();
        }

        // Block images/favicons everywhere (they can stall load)
        const isImagePath =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");
        if (isImagePath) return reply204();

        // Allow main doc + login route
        const isDoc =
          isApp && (u.pathname === "/" || u.pathname.startsWith("/login"));
        if (isDoc) return pass();

        // Allow backend API
        if (isBackend) return pass();

        // Everything else (externals, tracking, embeds) → fast 204
        return reply204();
      } catch {
        return pass();
      }
    });

    // --- 4) Visit and assert (45s cap)
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
