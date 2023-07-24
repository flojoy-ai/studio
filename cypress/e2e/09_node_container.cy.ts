/// <reference types="cypress" />

require("cypress-xpath");
describe("Verify node containers", () => {
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
    cy.xpath("//div[contains(text(), 'AI & ML')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with AI and Machine learning container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'AI & ML')]").click();

    //Select container SciPy
    cy.xpath("//div[contains(text(), 'Generate')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with SciPy container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Generate')]").click();

    //Select container NumPy
    cy.xpath("//div[contains(text(), 'Visualize')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with NumPy container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Visualize')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Extract')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Extractors container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Extract')]").click();

    //Select container Generators
    cy.xpath("//div[contains(text(), 'Transform')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Generators container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Transform')]").click();

    //Select container Loaders
    cy.xpath("//div[contains(text(), 'Load')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Loaders container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Load')]").click();

    //Select container Logic gates
    cy.xpath("//div[contains(text(), 'I/O')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Logic gates container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'I/O')]").click();

    //Select container Transformers
    cy.xpath("//div[contains(text(), 'Logic')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Transformer container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'Logic')]").click();

    //Select container Visualizers
    cy.xpath("//div[contains(text(), 'numpy')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Visualizers container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'numpy')]").click();
    cy.xpath("//div[contains(text(), 'scipy')]").click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with Visualizers container",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
    cy.xpath("//div[contains(text(), 'scipy')]").click();
  });
});
