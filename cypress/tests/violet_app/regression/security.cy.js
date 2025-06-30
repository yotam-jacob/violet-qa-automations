import { AUTOMATION_VIEW_NAME } from "/cypress/support/constants.js";

describe("Security Test Suite", () => {
  beforeEach(() => {
    cy.loginToVioletDev();
    cy.contains(AUTOMATION_VIEW_NAME).should("not.exist");
  });

  it("redirects unauthenticated users to the login page", () => {
    // Click on the user icon to log off
    cy.get("#logout-modal").check({ force: true });

    // Click on the "Logout" button to confirm
    cy.get("button.btn.btn-primary.text-white").contains("Logout").click();

    // Verify that the login page is displayed
    cy.contains("Growth Starts Here", { timeout: 10000 }).should("be.visible");

    // Visit a protected page directly
    cy.visit("https://dev.violetgrowth.com/", {
      failOnStatusCode: false,
    });

    // Assert that the login page is shown
    cy.url().should("include", "/login");
  });

  it("should not allow login with SQL injection input", () => {
    // Click on the user icon to log off
    cy.get("#logout-modal").check({ force: true });

    // Click on the "Logout" button to confirm
    cy.get("button.btn.btn-primary.text-white").contains("Logout").click();

    // Verify that the login page is displayed
    cy.contains("Growth Starts Here", { timeout: 10000 }).should("be.visible");

    // 1. Click "Sign in with email"
    cy.contains("Sign in with email").click();

    // 2. Enter email in the input labeled "Email Address", then click Continue
    cy.contains("Email Address")
      .parent()
      .find("input")
      .type("yotamjacob@walla.co.il");

    cy.contains("Continue").click();

    // Inject malicious input into email and password fields
    const sqlInjectionString = "' OR '1'='1";

    // 3. Enter password, then click Continue
    cy.get('input[type="password"]', { timeout: 10000 })
      .should("be.visible")
      .type(sqlInjectionString);
    cy.contains("Sign In").click();

    // Assert that an error message appears (adjust the message as per your app)
    cy.contains("Incorrect password").should("be.visible");
  });

  it("should not execute script when submitted into input fields", () => {
    const maliciousScript = "<script>alert(1)</script>";

    //Create new view
    cy.createView(maliciousScript);

    // Option 1: Assert the script text appears harmlessly (escaped or plain text)
    cy.contains(maliciousScript).should("exist");

    // Option 2: Assert no alert pops up (Cypress can't catch browser alerts easily but we can check DOM)
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.get("@alert").should("not.have.been.called");

    cy.contains(maliciousScript, { timeout: 20000 }).click();

    cy.contains(maliciousScript, {
      timeout: 20000,
    }).should("be.visible");

    //Delete the view
    cy.contains(
      "button.font-inter.flex.justify-between.group.items-center.relative.leading-3.px-2\\.5.font-medium.w-full.text-start.rounded-md.text-\\[13px\\].text-main-primaryPurple.bg-main-primaryPurple\\/\\[0\\.08\\]",
      maliciousScript
    ).realHover();

    cy.clickVisibleThreeDots();
    cy.clickOnDeleteViewAndVerify();
  });
});
