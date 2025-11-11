describe('Demo Public Availability', () => {
  it('shows Sign in with email on Dev', () => {
    cy.visit('https://dev.violetgrowth.com', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        // reduce bot heuristics and neutralize simple frame-busters
        Object.defineProperty(win.navigator, 'webdriver', { get: () => false });
        try { Object.defineProperty(win, 'top', { get: () => win }); } catch (_) {}
      },
    });

    // Ensure root exists and the spinner overlay (if present) goes away
    cy.get('#__next', { timeout: 60000 }).should('exist');
    cy.get('body').then(($b) => {
      if ($b.find('.animate-spin').length) {
        cy.get('.animate-spin', { timeout: 60000 }).should('not.exist');
      }
    });

    // Next.js page confirmed
    cy.window({ timeout: 60000 }).its('__NEXT_DATA__.page').should('eq', '/login');

    cy.contains('Sign in with email', { timeout: 60000 }).should('be.visible');
  });
});
