/// <reference types="cypress" />

describe("main page", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.
  it("main page", () => {
    cy.visit("/").wait(1000);

    cy.percySnapshot("dark flow page");

    // This nodeid value is from src/data/RECIPES.ts
    cy.get(
      '[data-testid="rf__node-SINE-c5df4e56-5ab8-447e-8ad9-6b7514ddb319"]'
    ).click();

    cy.percySnapshot("dark flow page with SINE menu");

    // Click add new node button
    cy.get('[data-testid="add-node-button"]').click();
    cy.percySnapshot("dark flow page with add node sidebar");

    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot("light flow page");
  });
});
