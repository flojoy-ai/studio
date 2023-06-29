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

    // get all custom nodes
    // CONDITIONAL NODE
    cy.get('[data-testid="add-node-button"]').click();
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.contains("button", "CONDITIONAL").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').contains("CONDITIONAL").click();
    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", ">").click();
    });
    cy.eyesCheckWindow({
      tag: "dark flow page with conditional node select",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

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
      tag: "light flow page with conditional node",
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
