/// <reference types="cypress" />

//** Tests loading an app.*/

describe("Loading an app", () => {
  it("Can load app correctly", () => {
    cy.visit("/").wait(1000);

    //test dark mode
    cy.get('[data-testid="dropdown-button"]').click({ force: true });

    cy.get('[id="load-app-btn"]').click({ force: true });
    cy.get("body")
      .get("input[type=file]")
      .selectFile("cypress/fixtures/load_test.txt", { force: true });

    cy.percySnapshot("Flow page after loading app");

    cy.get('[data-testid="node-wrapper"]').should("have.length", 1);
  });
});
