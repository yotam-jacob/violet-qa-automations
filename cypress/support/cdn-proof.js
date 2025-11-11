// Auto-cache Next.js assets and serve them from memory on every cy.visit
// Controlled by env: APP_HOST, BACKEND_HOST, CDN_PROOF (true|false)

const getEnv = () => ({
  appHost: Cypress.env("APP_HOST"),
  backendHost: Cypress.env("BACKEND_HOST"),
  enabled: `${Cypress.env("CDN_PROOF")}` === "true",
});

function extractNextAssets(html, appHost) {
  const js = [...String(html).matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map(
    (m) => m[1]
  );
  const css = [...String(html).matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map(
    (m) => m[1]
  );
  const abs = (path) => `https://${appHost}${path}`;
  const urls = Array.from(new Set([...js.map(abs), ...css.map(abs)]));
  urls.sort((a, b) => {
    const score = (url) =>
      url.includes("/chunks/webpack-")
        ? -2
        : url.includes("/chunks/main-")
        ? -1
        : 0;
    return score(a) - score(b);
  });
  return urls;
}

function buildCacheFor(url, appHost) {
  const cache = {};
  return cy
    .request({ url, failOnStatusCode: false, timeout: 20000 })
    .then((res) => {
      const assets = extractNextAssets(res.body, appHost);
      return cy.wrap(null).then(() => {
        assets.forEach((assetUrl) => {
          cy.request({ url: assetUrl, failOnStatusCode: false, timeout: 20000 }).then(
            (assetRes) => {
              const type = assetUrl.endsWith(".css")
                ? "text/css; charset=utf-8"
                : "application/javascript; charset=utf-8";
              cache[assetUrl] = {
                statusCode: assetRes.status,
                headers: { "content-type": type },
                body: assetRes.body,
              };
            }
          );
        });
      }).then(() => cache);
    });
}

Cypress.Commands.overwrite("visit", (orig, url, options = {}) => {
  const { appHost, backendHost, enabled } = getEnv();
  if (!enabled || !appHost) {
    return orig(url, options);
  }

  const pageUrl = typeof url === "string" ? url : url?.url || "";
  const absolute = pageUrl.startsWith("http")
    ? pageUrl
    : `https://${appHost}${pageUrl.startsWith("/") ? "" : "/"}${pageUrl}`;

  return buildCacheFor(absolute, appHost).then((cache) => {
    cy.intercept({ url: "**", middleware: true }, (req) => {
      try {
        const parsedUrl = new URL(req.url);
        const isAppHost = parsedUrl.host === appHost;
        const isBackendHost = backendHost && parsedUrl.host === backendHost;

        if (isAppHost && parsedUrl.pathname.startsWith("/_next/static/")) {
          const key = req.url;
          if (cache[key]) return req.reply(cache[key]);
          return req.continue();
        }

        if (isBackendHost) return req.continue();

        const isImage =
          /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(parsedUrl.pathname) ||
          parsedUrl.pathname.startsWith("/_next/image");
        if (isImage) return req.reply({ statusCode: 204, body: "" });

        if (isAppHost) return req.continue();
        return req.reply({ statusCode: 204, body: "" });
      } catch {
        return req.continue();
      }
    });

    return orig(url, {
      failOnStatusCode: false,
      ...options,
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        if (typeof options.onBeforeLoad === "function") options.onBeforeLoad(win);
      },
    });
  });
});
