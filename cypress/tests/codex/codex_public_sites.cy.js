describe("Codex Public Availability", () => {
  it("loads google.com successfully", () => {
    cy.visit("https://www.google.com");
    cy.title({ timeout: 30000 }).should("include", "Google");
  });

  it("shows Sign in with email on Dev", () => {
    cy.visit("https://dev.violetgrowth.com/login?from=/", { failOnStatusCode: false });
    cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  });

  // it("shows Sign in with email on Staging", () => {
  //   cy.visit("https://staging.violetgrowth.com/", { failOnStatusCode: false });
  //   cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  // });

  // it("shows Sign in with email on Production", () => {
  //   cy.visit("https://app.violetgrowth.com/", { failOnStatusCode: false });
  //   cy.contains("Sign in with email", { timeout: 30000 }).should("be.visible");
  // });
});
