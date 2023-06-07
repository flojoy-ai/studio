/// <reference types="cypress" />
require('cypress-xpath')
describe("Verify Add and Delete node", () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: "studio",
      testName: Cypress.currentTest.title,
    });
  });

  it("should open flojoy studio's main page", () => {
    cy.visit("/").wait(1000);

    cy.eyesCheckWindow({
      tag: "dark flow page",
      target: "window",
      fully: true,
    });
// Click add node
    cy.get('[data-testid="add-node-button"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with add node sidebar",
      target: "window",
      fully: true,
    });
    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Loaders')]").click();
    // Select LOADER node
    cy.xpath("//button[.='LOADER']").click();
    // Close sidebar
    cy.get('[data-testid="sidebar-close"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with node loader",
      target: "window",
      fully: true,
    });
    // Click on added container LOADER
    cy.xpath("//div[contains(text(), 'LOADER')]").click();
    //Delete node LOADER
    cy.get('.tabler-icon-x[width=\'24\']').click();
    cy.eyesCheckWindow({
      tag: "dark flow page",
      target: "window",
      fully: true,
    });
    cy.xpath("//div[contains(text(), 'LOADER')]").should('not.exist', "//div[contains(text(), 'LOADER')]");
  });
  afterEach(() => {
    cy.eyesClose();
  });
});
