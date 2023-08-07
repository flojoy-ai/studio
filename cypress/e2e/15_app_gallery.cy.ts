/// <reference types="cypress" />

//** Tests app gallery feature.*/

describe("Checking app gallery feature", () => {
  it("apps can be selected properly from app gallery", () => {
    cy.visit("/").wait(1000);

    cy.get(`[data-testid="app-gallery-btn"]`).click();

    cy.percySnapshot("App Gallery Layout");

    
    // // Upload the file
    // cy.get("body")
    //   .get("input[type=file]")
    //   .selectFile("cypress/fixtures/load_test.txt", { force: true });

    // cy.percySnapshot("Flow page after loading app");

    // // Check that the app contains exactly 1 node
    // cy.get('[data-testid="node-wrapper"]').should("have.length", 1);
  });
});
