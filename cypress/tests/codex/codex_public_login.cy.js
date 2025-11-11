describe("Codex Public Logins", () => {
  it("logs into Violet Dev", () => {
    cy.loginToVioletDev();
  });

  it("logs into Violet Staging", () => {
    cy.loginToVioletStg();
  });
});
