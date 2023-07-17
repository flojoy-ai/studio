/// <reference types="cypress" />

require("cypress-xpath");

//** Captures all plotly component nodes in light/dark mode.*/

describe("Set plotly node visual tests", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];
  // This method performs setup before each test.
  beforeEach(() => {
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    eyes.setParentBranchName(<main>)
    eyes.setBranchName(<develop>)
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

  it("plotly nodes visual test", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();
    //Select container Visualizers
    cy.xpath("//div[contains(text(), 'Visualizers')]").click();

    // get all viz nodes
    cy.xpath("//button[.='SCATTER3D']").click();
    cy.xpath("//button[.='LINE']").click();
    cy.xpath("//button[.='HISTOGRAM']").click();
    cy.xpath("//button[.='IMAGE']").click();
    cy.xpath("//button[.='COMPOSITE']").click();
    cy.xpath("//button[.='BAR']").click();
    cy.xpath("//button[.='BIG_NUMBER']").click();
    cy.xpath("//button[.='SURFACE3D']").click();
    cy.xpath("//button[.='PROPHET_PLOT']").click();
    cy.xpath("//button[.='SCATTER']").click();
    cy.xpath("//button[.='PROPHET_COMPONENTS']").click();
    cy.xpath("//button[.='TABLE']").click();
    cy.xpath("//button[.='MATRIX_VIEW']").click();
    cy.xpath("//button[.='ARRAY_VIEW']").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with Scatter3d node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with Scatter3d node",
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
