describe("Demo Public Availability", () => {
  it("shows Sign in with email on Dev", () => {
    cy.visit("https://dev.violetgrowth.com", { failOnStatusCode: false });

    // wait for root app mount
    cy.get("#__next", { timeout: 60000 }).should("be.visible");

    // fallback text check
    cy.contains("Sign in with email", { timeout: 60000 }).should("be.visible");
  });
});
