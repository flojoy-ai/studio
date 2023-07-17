/// <reference types="cypress" />

describe("Verify end node", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];
  // This method performs setup before each test.
  beforeEach(() => {
    
    eyes.setParentBranchName(<main>)
    eyes.setBranchName(<develop>)

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

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("end node test", () => {
    cy.visit("/").wait(1000);

    // Click clear canvas button
    cy.get('[data-testid="clear-canvas-button"]').click();

    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click end node
    cy.get('[data-testid="end-node-btn"]').click();

    // close sidebar
    cy.get('[data-testid="sidebar-close"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with end node",
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
