/// <reference types="cypress" />

describe("Verify end node", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("end node test", () => {
    cy.visit("/").wait(1000);

    // Click clear canvas button
    cy.get('[data-testid="clear-canvas-button"]').click();

    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click end node
    cy.get('[data-testid="end-node-btn"]').click();

    // close sidebar
    cy.get('[data-testid="sidebar-close"]').click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with end node",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
  });
});
