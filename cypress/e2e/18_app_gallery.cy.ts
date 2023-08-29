/// <reference types="cypress" />

//** Tests app gallery feature.*/

describe("Checking app gallery feature", () => {
  it("apps can be selected properly from app gallery", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    cy.get(`[data-testid="app-gallery-btn"]`).click();
    // Select "Intro to LOOPS"
    cy.get('[data-testid="gallery-load-button"]').eq(0).click();

    // center screen
    cy.get("body").type("{cmd}1");
    // capture that corresponding snapshot has been generated correctly
    cy.percySnapshot("Correctly generated app");

    // Check that app contains exactly 3 nodes
    cy.get('[data-testid="node-wrapper"]').should("have.length", 7);
  });
});
