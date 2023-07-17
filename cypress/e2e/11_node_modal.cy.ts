/// <reference types="cypress" />

//** Tests basic toggle functionality for dropdown menu and captures the results as snapshots in light/dark mode.*/

describe("Verify node modal", () => {
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

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("node modal test", () => {
    cy.visit("/").wait(1000);

    cy.get(
      '[data-testid="rf__node-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f"]'
    ).click();

    // Click expand button
    cy.get('[data-testid="expand-button"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with Histogram node modal",
      target: "window",
      fully: true,
    });
    cy.get('[data-testid="node-modal-closebtn"]').click();

    // Test in light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get(
      '[data-testid="rf__node-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f"]'
    ).click();
    cy.get('[data-testid="expand-button"]').click();
    cy.eyesCheckWindow({
      tag: "light flow page with Histogram node modal",
      target: "window",
      fully: true,
    });
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
