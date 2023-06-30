/// <reference types="cypress" />

require("cypress-xpath");

describe("Set custom node visual tests", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];
  // This method performs setup before each test.
  beforeEach(() => {
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    cy.eyesOpen({
      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      appName: "studio",

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      testName: Cypress.currentTest.title,
    });
  });

  it("custom nodes viz test", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="clear-canvas-button"]').click();

    // GET ALL CUSTOM NODES

    // conditional node
    cy.get('[data-testid="add-node-button"]').click();
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.contains("button", "CONDITIONAL").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="data-label-design"]').contains("CONDITIONAL").click();
    // check if selected operator is displayed on node box
    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", ">").click();
    });

    cy.get('[data-testid="conditional-operator-type"]').and(($div) => {
      expect($div.text()).to.contain(">");
    });

    cy.eyesCheckWindow({
      tag: "dark flow page with conditional node select",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    cy.get('[data-testid="node-edit-modal-close-btn"]', {}).click();

    cy.get('[data-testid="add-node-button"]').click();
    cy.xpath("//div[contains(text(), 'Generators')]").click();
    cy.xpath("//button[.='CONSTANT']").click();
    cy.xpath("//button[.='CONSTANT']").click();
    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="add-node-button"]').click();
    cy.xpath("//div[contains(text(), 'Visualizers')]").click();
    cy.xpath("//button[.='LINE']").click();
    cy.xpath("//button[.='LINE']").click();
    cy.get('[data-testid="sidebar-close"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with conditional node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with conditional node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="clear-canvas-button"]').click();

    // creating loop node
    cy.get('[data-testid="add-node-button"]').click();
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.contains("button", "LOOP").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').click();
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(10);
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with loop node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Switch to dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with loop node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // creating numpy node
    cy.get('[data-testid="add-node-button"]').click();
    cy.get('[data-testid="sidebar-input"]').type("tensorinv");
    cy.contains("button", "TENSORINV").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="data-label-design"]').contains("TENSORINV").click();
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(2);
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    // CREATING SCIPY NODE
    cy.get('[data-testid="add-node-button"]').click();
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("argrelmax");
    cy.contains("button", "ARGRELMAX").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="data-label-design"]').contains("ARGRELMAX").click();
    cy.get('[data-testid="int-input"]').each(($element) => {
      cy.get($element).type(3);
    });
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with numpy and scipy node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with numpy node",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with scipy node",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with numpy and scipy nodes",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
