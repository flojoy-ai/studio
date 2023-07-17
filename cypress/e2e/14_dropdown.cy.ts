/// <reference types="cypress" />

//** Tests basic toggle functionality for dropdown menu and captures the results as snapshots in light/dark mode.*/

describe("Verify drop down button", () => {
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

  it("drop down wrapper", () => {
    const layoutRegions = [
      { selector: '[data-cy="app-status"]' },
      { selector: '[data-cy="btn-play"]' },
    ];

    cy.visit("/").wait(1000);

    //test dark mode
    cy.get('[data-testid="dropdown-wrapper"]').trigger("mouseover");
    cy.eyesCheckWindow({
      tag: "dark flow page with dropdown bar",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="dropdown-wrapper"]', { timeout: 1000 }).trigger(
      "mouseout"
    );

    cy.get('[data-testid="darkmode-toggle"]').click();

    // test light mode
    cy.get('[data-testid="dropdown-wrapper"]').trigger("mouseover");
    cy.eyesCheckWindow({
      tag: "light flow page with dropdown bar",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="dropdown-wrapper"]', { timeout: 1000 }).trigger(
      "mouseout"
    );
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
