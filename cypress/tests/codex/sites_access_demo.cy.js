describe("Demo Public Availability", () => {
  it("shows Sign in with email on Dev", () => {
    cy.visit("https://dev.violetgrowth.com/login?from=/", {
      onBeforeLoad(win) {
        // prevent heavy libs from mounting if your code gates on these
        // (guard with env checks in your app for cleanliness)
        win.Tableau = win.Tableau || {};
        win.ClickUp = win.ClickUp || {};
      },
      failOnStatusCode: false,
    });

    // wait for root app mount
    cy.get("#__next", { timeout: 60000 }).should("be.visible");

    // fallback text check
    cy.contains("Sign in with email", { timeout: 60000 }).should("be.visible");
  });
});
