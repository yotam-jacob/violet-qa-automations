/// <reference types="cypress" />

describe('Navigation Tests for exacti.us', () => {
  const baseUrl = 'https://exacti.us'

  beforeEach(() => {
    cy.visit(baseUrl)
  })

  it('Clicks "Exactius Growth" and navigates to /growth', () => {
    cy.contains('Exactius Growth').click()
    cy.url().should('eq', `${baseUrl}/growth`)
  })

  it('Clicks "Violet Growth Platform" and verifies new tab to violetgrowth.com', () => {
    cy.contains('Violet Growth Platform')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href').and('include', 'https://violetgrowth.com/')
  })

  it('Hovers "Company" and clicks "Homepage" to stay on homepage', () => {
    cy.contains('Company').realHover()
    cy.contains('Homepage')
      .should('be.visible')
      .click()
    cy.url().should('eq', `${baseUrl}/`)
  })

  it('Hovers "Company" and clicks "Blog" to open playbooks in new tab', () => {
    cy.contains('Company').realHover()
    cy.contains('Blog')
    .should('have.attr', 'href', 'https://insights.exacti.us/')
    .and('have.attr', 'target', '_blank')
  })

  it('Hovers "Company" and clicks "Who We Are" to go to /who-we-are', () => {
    cy.contains('Company').realHover()
    cy.contains('Who We Are').click()
    cy.url().should('eq', `${baseUrl}/who-we-are`)
  })

  it('Hovers "Company" and clicks "We\'re Hiring" to go to /join-the-team', () => {
    cy.contains('Company').realHover()
    cy.contains("We're Hiring").click()
    cy.url().should('eq', `${baseUrl}/join-the-team`)
  })

  it('Clicks "Let\'s Connect" to open lets-connect', () => {
    cy.contains("Let's Connect").click()
    cy.url().should('eq', `${baseUrl}/lets-connect`)
  })

  it('Clicks all visible "Let\'s Connect" buttons and verifies they open /lets-connect', () => {
    cy.get('a,button') // search both anchors and buttons
      .contains("Let's Connect")
      .filter(':visible')
      .each($el => {
        const href = $el.attr('href')
        const expectedUrl = href?.startsWith('/')
          ? `${baseUrl}${href}`
          : href
  
        if (expectedUrl) {
          cy.visit(expectedUrl)
          cy.url().should('include', '/lets-connect')
          cy.visit(baseUrl) // reset for next iteration
        }
      })
  })

  it('Clicks "Learn more" linking to violetgrowth.com (partial match)', () => {
    cy.contains('a', 'Learn more')
      .filter('[href*="https://violetgrowth.com/"]')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href')
      .and('include', 'https://violetgrowth.com/')
  })

  it('Clicks "Learn more" linking to exactiuscapital.com', () => {
    cy.get('a[href="https://www.exactiuscapital.com/"]')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href', 'https://www.exactiuscapital.com/')
  })

  it('Clicks LinkedIn link and verifies URL', () => {
    cy.get('a[href="https://www.linkedin.com/company/exactius"]')
      .should('have.attr', 'target', '_blank')
  })

  it('Clicks X (Twitter) link and verifies URL', () => {
    cy.get('a[href="https://x.com/exactius"]')
      .should('have.attr', 'target', '_blank')
  })

  it('Clicks anchor with href="/growth#Features"', () => {
    cy.get('a[href="/growth#Features"]')
      .first()
      .click({ force: true })
  
    cy.url().should('include', '/growth#Features')
  })

  it('Clicks "Benefits" to open /growth#Benefit', () => {
    cy.get('a[href="/growth#Benefit"]')
      .first()
      .click({ force: true })
  
    cy.url().should('include', '/growth#Benefit')
  })

  it('Clicks "Solutions By Role" to open /growth#Users', () => {
    cy.get('a[href="/growth#Users"]')
      .first()
      .click({ force: true })
  
    cy.url().should('include', '/growth#Users')
  })

  it('Clicks "Use Cases" to open /growth#UseCases', () => {
    cy.get('a[href="/growth#UseCases"]')
      .first()
      .click({ force: true })
  
    cy.url().should('include', '/growth#UseCases')
  })

  it('Clicks "Beyond Department KPIs" to open violetgrowth.com', () => {
    cy.contains('Beyond Department KPIs')
      .should('have.attr', 'href').and('include', 'https://violetgrowth.com/')
  })

  it('Clicks "More than Software" to open violetgrowth.com', () => {
    cy.contains('More than Software')
      .should('have.attr', 'href').and('include', 'https://violetgrowth.com/')
  })

  it('Clicks "Fully Customized" to open violetgrowth.com', () => {
    cy.contains('Fully Customized')
      .should('have.attr', 'href').and('include', 'https://violetgrowth.com/')
  })

  it('Clicks "Swift A-Z Deployment" to open violetgrowth.com', () => {
    cy.contains('Swift A-Z Deployment')
      .should('have.attr', 'href').and('include', 'https://violetgrowth.com/')
  })

  it('Clicks "Blog" in footer/menu to open playbooks in new tab', () => {
    cy.contains('Blog')
      .should('have.attr', 'href', 'https://insights.exacti.us/')
      .and('have.attr', 'target', '_blank')
  })

  it('Clicks "Who We Are" in footer/menu to go to /who-we-are', () => {
    cy.contains('Who We Are')
    .scrollIntoView()
    .click({ force: true })
    cy.url().should('eq', `${baseUrl}/who-we-are`)
  })

  it('Clicks "We\'re Hiring" in footer/menu to go to /join-the-team', () => {
    cy.contains("We're Hiring")
    .scrollIntoView()
    .click({ force: true })
    cy.url().should('eq', `${baseUrl}/join-the-team`)
  })

  it('Clicks Google Partners link to open in new tab', () => {
    cy.get('a[href="https://www.google.com/partners/agency?id=9710556056"]')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href').and('include', 'google.com/partners/agency')
  })
})
