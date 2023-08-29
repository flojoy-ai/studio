/// <reference types="cypress" />

require("cypress-xpath");

describe("Verify Add and Delete node", () => {
  it("Verify Add and Delete node", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="confirm-clear-canvas"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Load')]").click();
    //Select container Loaders
    cy.xpath("//div[contains(text(), 'LOCAL_FILE_SYSTEM')]").click();
    // Select LOADER node
    cy.xpath("//button[.='LOCAL_FILE']").click();
    // Close sidebar
    cy.get('[data-testid="sidebar-close"]').click();
    cy.percySnapshot("dark flow page with node loader");
    // Click on added container LOADER
    cy.get('[data-testid="node-wrapper"]').click();
    // Turn edit mode on
    cy.get('[data-testid="toggle-edit-mode"]').click();
    // Delete the node
    cy.get('[data-testid="delete-node-button"]').click();
  });
});
