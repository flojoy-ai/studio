/// <reference types="cypress" />

describe("main page", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.
  it("main page", () => {
    cy.visit("/").wait(1000);

    cy.eyesCheckWindow({
      tag: "dark flow page",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // This nodeid value is from src/data/RECIPES.ts
    cy.get(
      '[data-testid="rf__node-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd"]'
    ).click();

    cy.eyesCheckWindow({
      tag: "dark flow page with SINE menu",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Click add new node button
    cy.get('[data-testid="add-node-button"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add node sidebar",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.eyesCheckWindow({
      tag: "light flow page",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });
});
