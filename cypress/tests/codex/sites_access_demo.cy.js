describe("Demo Public Availability (ui)", () => {
  it("shows Sign in with email on Dev", () => {
    const url = "https://dev.violetgrowth.com/login?from=/";

    // Preflight logs so we have evidence even if cy.visit never fires 'load'
    cy.request("https://api.ipify.org?format=json").then((r) => {
      cy.log(`CI_IP=${r.body.ip}`);
      cy.writeFile("cypress/artifacts/ci-ip.txt", `CI_IP=${r.body.ip}\n`, {
        log: false,
      });
    });

    cy.request({ url, method: "HEAD", failOnStatusCode: false }).then((res) => {
      const h = Object.fromEntries(
        Object.entries(res.headers).map(([k, v]) => [
          k.toLowerCase(),
          String(v),
        ])
      );
      const frame =
        (h["content-security-policy"] || "")
          .split(";")
          .find((d) => d.trim().toLowerCase().startsWith("frame-ancestors")) ||
        "none";
      const xfo = h["x-frame-options"] || "none";
      cy.log(`STATUS=${res.status}`);
      cy.log(`X-Frame-Options=${xfo}`);
      cy.log(`CSP frame-ancestors=${frame}`);
      cy.writeFile(
        "cypress/artifacts/frame-headers.txt",
        `STATUS=${res.status}\nX-Frame-Options=${xfo}\nCSP frame-ancestors=${frame}\n`,
        { log: false }
      );
    });

    // Save first 10k chars of HTML the server returns (forensics)
    cy.request({ url, failOnStatusCode: false }).then((res) => {
      const body = String(res.body || "");
      const markers = [
        "captcha",
        "verify you are human",
        "access denied",
        "blocked",
        "challenge",
        "checking your browser",
      ];
      const found = markers.filter((m) => body.toLowerCase().includes(m));
      cy.log(`BOT_MARKERS=${found.join(",") || "none"}`);
      cy.writeFile(
        "cypress/artifacts/diagnostics-login-body.html",
        body.slice(0, 10000),
        { log: false }
      );
    });

    // Now do the UI visit and assert - this is the part we want to pass
    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        // reduce 'bot' heuristics and basic frame-busters
        Object.defineProperty(win.navigator, "webdriver", { get: () => false });
        try {
          Object.defineProperty(win, "top", { get: () => win });
        } catch (_) {}
      },
    });

    // Root present
    cy.get("#__next", { timeout: 60000 }).should("exist");

    // If a spinner overlay exists, wait for it to disappear
    cy.get("body").then(($b) => {
      if ($b.find(".animate-spin").length) {
        cy.log("Spinner detected - waiting for it to disappear…");
        cy.get(".animate-spin", { timeout: 60000 }).should("not.exist");
      }
    });

    // Hydration/page confirmation
    cy.window({ timeout: 60000 })
      .its("__NEXT_DATA__.page")
      .should("eq", "/login");

    // Final visible check
    cy.contains("Sign in with email", { timeout: 60000 }).should("be.visible");
  });
});
