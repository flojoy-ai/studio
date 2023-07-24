/// <reference types="cypress" />

//** Tests basic toggle functionality for dropdown menu and captures the results as snapshots in light/dark mode.*/

describe("Verify node modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("node modal test", () => {
    cy.visit("/").wait(1000);

    cy.get(
      '[data-testid="rf__node-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f"]'
    ).click();

    // Click expand button
    cy.get('[data-testid="expand-button"]').click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Histogram node modal",
    //   target: "window",
    //   fully: true,
    // });
    cy.get('[data-testid="node-modal-closebtn"]').click();

    // Test in light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get(
      '[data-testid="rf__node-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f"]'
    ).click();
    cy.get('[data-testid="expand-button"]').click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "light flow page with Histogram node modal",
    //   target: "window",
    //   fully: true,
    // });
  });
});
