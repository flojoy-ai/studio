/// <reference types="cypress" />

require("cypress-xpath");

describe("Verify Add and Delete node", () => {
  it("Verify Add and Delete node", () => {
    cy.visit("/").wait(1000);

    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    cy.percySnapshot("dark flow page with add node sidebar");
    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Loaders')]").click();
    // Select LOADER node
    cy.xpath("//button[.='LOADER']").click();
    // Close sidebar
    cy.get('[data-testid="sidebar-close"]').click();
    cy.percySnapshot("dark flow page with node loader");
    // Click on added container LOADER
    cy.xpath("//div[contains(text(), 'LOADER')]").click();
    //Delete node LOADER
    cy.get(".tabler-icon-x[width='24']").click();
    cy.percySnapshot("dark flow page");
    cy.xpath("//div[contains(text(), 'LOADER')]").should(
      "not.exist",
      "//div[contains(text(), 'LOADER')]"
    );
  });
});
