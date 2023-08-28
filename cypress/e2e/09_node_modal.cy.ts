/// <reference types="cypress" />

//** Tests basic toggle functionality for dropdown menu and captures the results as snapshots in light/dark mode.*/

describe("Verify node modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("node modal test", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    cy.get(
      '[data-testid="rf__node-SINE-b3fe92c7-36bf-4869-b25b-51c86b125e08"]',
    ).click();
    cy.get('[data-testid="toggle-edit-mode"]').click();

    // Click expand button
    cy.get('[data-testid="node-info-button"]').click();
    cy.percySnapshot("dark mode with SINE expand button clicked");
    cy.get('button:contains("x")').click({ force: true, multiple: true });

    // Test in light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="node-info-button"]').click();

    cy.percySnapshot("light mode with SINE expand button clicked");
  });
});
