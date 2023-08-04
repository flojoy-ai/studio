/// <reference types="cypress" />

describe("Verify Env Variable Modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("env variable modal test", () => {
    cy.visit("/").wait(1000);

    // Clear canvas
    cy.get('[data-testid="settings-btn"]').click();

    cy.percySnapshot("dark flow page with setting dropdown");

    cy.get('[data-testid="envVariablesModalBtn"]').click();

    cy.percySnapshot("dark flow page with env Modal");

    cy.get('[data-testid="EnvVarKeyInput"]').click().type("CypressTest");

    cy.percySnapshot("dark flow page with key input");

    cy.get('[data-testid="EnvVarValueInput"]').click().type("CypressTestValue");

    cy.percySnapshot("dark flow page with value input");

    cy.get('[data-testid="envModalAddBtn"]').click();

    // Verify there aren't any nodes
    // cy.get('[data-testid="node-wrapper"]').should("have.length", 0);
  });
});
