/// <reference types="cypress" />

describe("Verify clear canvas button", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("clear canvas test", () => {
    cy.visit("/").wait(1000);

    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.percySnapshot("dark flow page without any nodes");

    // Verify there aren't any nodes
    cy.get('[data-testid="node-wrapper"]').should("have.length", 0);
  });
});
