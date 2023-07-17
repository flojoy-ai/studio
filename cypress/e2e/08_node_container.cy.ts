/// <reference types="cypress" />

require("cypress-xpath");
describe("Verify node containers", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];
  // beforeEach(() => {
  //   cy.eyesOpen({
  //     appName: "studio",
  //     testName: Cypress.currentTest.title,
  //   });
  // });

  it("Verify node containers tabs", () => {
    cy.visit("/").wait(1000);

    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click expand and sidebar btn
    cy.get('[data-testid="sidebar-expand-btn"]').click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page after clicking sidebar expand btn",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.get('[data-testid="sidebar-collapse-btn"]').click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page after clicking sidebar collapse btn",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    //Select container AI and Machine Learning
    cy.xpath("//div[contains(text(), 'AI and Machine learning')]").click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with AI and Machine learning container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'AI and Machine learning')]").click();

    //Select container SciPy
    cy.xpath("//div[contains(text(), 'SCIentific PYthon (SciPy)')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with SciPy container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'SCIentific PYthon (SciPy)')]").click();

    //Select container NumPy
    cy.xpath("//div[contains(text(), 'NUMeric PYthon (NumPy)')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with NumPy container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'NUMeric PYthon (NumPy)')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Extractors')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Extractors container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Extractors')]").click();

    //Select container Generators
    cy.xpath("//div[contains(text(), 'Generators')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Generators container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Generators')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Loaders')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Loaders container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Loaders')]").click();

    //Select container Logic gates
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Logic gates container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();

    //Select container Transformers
    cy.xpath("//div[contains(text(), 'Transformers')]").click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Transformer container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Transformers')]").click();

    //Select container Visualizers
    cy.xpath("//div[contains(text(), 'Visualizers')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Visualizers container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Visualizers')]").click();
  });
  // afterEach(() => {
  //   cy.eyesClose();
  // });
});
