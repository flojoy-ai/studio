/// <reference types="cypress" />

require("cypress-xpath");

describe("Verify Add and Delete node", () => {
  it("Verify Add and Delete node", () => {
    cy.visit("/").wait(1000);

    // Click add node
    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.percySnapshot("dark flow page with add node sidebar");
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
    //Delete node LOADER
    cy.get(".tabler-icon-x[width='24']").click({force:true});
    cy.percySnapshot("dark flow page");
  });
});
