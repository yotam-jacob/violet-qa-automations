describe("Demo Public Availability", () => {
  it("shows Sign in with email on Dev", () => {
    cy.visit("https://dev.violetgrowth.com", { failOnStatusCode: false });
    cy.contains("Sign in with email", { timeout: 50000 }).should("be.visible");
  });
});
