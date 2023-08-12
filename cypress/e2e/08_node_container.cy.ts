/// <reference types="cypress" />

require("cypress-xpath");
describe("Verify node containers", () => {
  it("Verify node containers tabs", () => {
    cy.visit("/").wait(1000);

    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click expand and sidebar btn
    cy.get('[data-testid="sidebar-expand-btn"]').click();
    cy.percySnapshot("dark flow page after clicking sidebar expand btn");

    cy.get('[data-testid="sidebar-collapse-btn"]').click();
    cy.percySnapshot("dark flow page after clicking sidebar collapse btn");

    //Select container AI and Machine Learning
    cy.xpath("//div[contains(text(), 'AI & ML')]").click();
    cy.percySnapshot("dark flow page with AI and Machine learning container");
    cy.xpath("//div[contains(text(), 'AI & ML')]").click();

    //Select container SciPy
    cy.xpath("//div[contains(text(), 'Generate')]").click();
    cy.percySnapshot("dark flow page with Generate container");
    cy.xpath("//div[contains(text(), 'Generate')]").click();

    //Select container NumPy
    cy.xpath("//div[contains(text(), 'Visualize')]").click();
    cy.percySnapshot("dark flow page with Visualize container");
    cy.xpath("//div[contains(text(), 'Visualize')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Extract')]").click();
    cy.percySnapshot("dark flow page with Extractors container");
    cy.xpath("//div[contains(text(), 'Extract')]").click();

    //Select container Generators
    cy.xpath("//div[contains(text(), 'Transform')]").click();
    cy.percySnapshot("dark flow page with Transform container");
    cy.xpath("//div[contains(text(), 'Transform')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Load')]").click();
    cy.percySnapshot("dark flow page with Load container");
    cy.xpath("//div[contains(text(), 'Load')]").click();

    //Select container Logic gates
    cy.xpath("//div[contains(text(), 'I/O')]").click();
    cy.percySnapshot("dark flow page with I/O container");
    cy.xpath("//div[contains(text(), 'I/O')]").click();

    //Select container Transformers
    cy.xpath("//div[contains(text(), 'Logic')]").click();
    cy.percySnapshot("dark flow page with Logic container");
    cy.xpath("//div[contains(text(), 'Logic')]").click();

    //Select container Visualizers
    cy.xpath("//div[contains(text(), 'numpy')]").click();
    cy.percySnapshot("dark flow page with numpy container");
    cy.xpath("//div[contains(text(), 'numpy')]").click();

    cy.xpath("//div[contains(text(), 'scipy')]").click();
    cy.percySnapshot("dark flow page with scipy container");
    cy.xpath("//div[contains(text(), 'scipy')]").click();
  });
});
