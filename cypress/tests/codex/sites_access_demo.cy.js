describe("Demo Public Availability", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("shows Sign in with email on Dev", () => {
    cy.visit("https://dev.violetgrowth.com", {
      auth: {
        username: "yotamjacob@walla.co.il",
        password: "Eggrolls1246!",
      },
      failOnStatusCode: false,
    });
    cy.contains("Sign in with email", { timeout: 50000 }).should("be.visible");
  });
});
