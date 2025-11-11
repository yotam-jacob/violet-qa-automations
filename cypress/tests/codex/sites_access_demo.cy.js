describe("Demo Public Availability (ui)", () => {
  it("shows Sign in with email on Dev", () => {
    const appHost = "dev.violetgrowth.com";
    const backendHost = "dev.api.violetgrowth.com";
    const url = `https://${appHost}/login?from=/`;

    // 1) Discover and fetch Next.js static assets (webpack/main/page/css) before visiting
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
      const all = Array.from(new Set([...js.map(abs), ...css.map(abs)])).sort(
        (a, b) => {
          const score = (u) =>
            u.includes("/chunks/webpack-")
              ? -2
              : u.includes("/chunks/main-")
              ? -1
              : 0;
          return score(a) - score(b);
        }
      );
      nextAssets.push(...all);
    });

    // 2) Fetch the assets and cache in memory for instant replies
    const cache = {};
    cy.then(() => {
      nextAssets.forEach((u) => {
        cy.request({ url: u, failOnStatusCode: false, timeout: 20000 }).then(
          (r) => {
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

    // 3) Intercept:
    // - Serve /_next/static/** from our in-memory cache
    // - Allow backend API
    // - Stub images and all third-party hosts to avoid load stalls
    cy.intercept({ url: "**", middleware: true }, (req) => {
      try {
        const u = new URL(req.url);
        const isApp = u.host === appHost;
        const isBackend = u.host === backendHost;

        // Serve Next static js/css from cache
        if (isApp && u.pathname.startsWith("/_next/static/")) {
          const key = req.url;
          if (cache[key]) return req.reply(cache[key]);
          return req.continue();
        }

        // Backend API always allowed
        if (isBackend) return req.continue();

        // Block images/favicons everywhere to keep load fast
        const isImg =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(u.pathname) ||
          u.pathname.startsWith("/_next/image");
        if (isImg) return req.reply({ statusCode: 204, body: "" });

        // Allow app HTML/resources; stub everything else (externals)
        if (isApp) return req.continue();
        return req.reply({ statusCode: 204, body: "" });
      } catch {
        return req.continue();
      }
    });

    // 4) Visit and assert
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
      },
    });

    cy.get("#__next", { timeout: 45000 }).should("exist");
    cy.contains("Sign in with email", { timeout: 45000 }).should("be.visible");
  });
});
