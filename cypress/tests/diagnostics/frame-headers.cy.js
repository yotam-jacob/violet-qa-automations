describe("Frame headers", () => {
  it("logs X-Frame-Options and CSP", () => {
    const url = "https://dev.violetgrowth.com/login?from=/";

    cy.request({ url, method: "HEAD", failOnStatusCode: false }).then((res) => {
      const headers = Object.fromEntries(
        Object.entries(res.headers).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ])
      );

      cy.log(`STATUS=${res.status}`);
      cy.log(`X-Frame-Options=${headers["x-frame-options"] || "none"}`);

      const csp = headers["content-security-policy"] || "";
      const frameAncestorsDirective =
        csp
          .split(";")
          .find((directive) =>
            directive.trim().toLowerCase().startsWith("frame-ancestors")
          ) || "none";

      cy.log(`CSP frame-ancestors=${frameAncestorsDirective}`);
    });
  });
});
