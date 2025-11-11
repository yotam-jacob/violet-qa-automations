// cypress/tests/codex/sites_access_demo.cy.js
describe('Demo Public Availability (ui)', () => {
  it('shows Sign in with email on Dev', () => {
    cy.visit('/login?from=/'); // cdn-proof applied automatically
    cy.get('#__next', { timeout: 45000 }).should('exist');
    cy.contains('Sign in with email', { timeout: 45000 }).should('be.visible');
  });
});
