describe('Demo Public Availability', () => {
  it('shows Sign in with email on Dev', () => {
    cy.visit('https://dev.violetgrowth.com', { failOnStatusCode: false });

    // Wait for React root and spinner removal
    cy.get('#__next', { timeout: 60000 }).should('exist');

    // Wait until spinner overlay disappears
    cy.get('body').then(($b) => {
      if ($b.find('.animate-spin').length) {
        cy.log('Waiting for spinner to disappear...');
        cy.get('.animate-spin', { timeout: 60000 }).should('not.exist');
      }
    });

    // Wait for DOM hydration (Next.js sets __NEXT_DATA__)
    cy.window({ timeout: 60000 })
      .its('__NEXT_DATA__.page')
      .should('eq', '/login');

    // Finally check for the element
    cy.contains('Sign in with email', { timeout: 60000 }).should('be.visible');
  });
});
