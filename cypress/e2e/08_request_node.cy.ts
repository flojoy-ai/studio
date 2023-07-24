/// <reference types="cypress" />

require("cypress-xpath");
describe("Requesting node", () => {
  it("request node btn test", () => {
    cy.visit("/").wait(1000);

    cy.percySnapshot("dark flow page");
    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click request node
    cy.get('[data-testid="request-node-btn"]').click();

    cy.percySnapshot("new page with node request form");
  });
});
