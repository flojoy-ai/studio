/// <reference types="cypress" />

describe("playing script", () => {
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

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.
  it("show results after pressing play on main homepage", () => {
    cy.visit("/").wait(1000);

    //click on play button
    cy.get('[data-testid="btn-play"]').click();

    // // snap home page during script play
    cy.eyesCheckWindow({
      tag: "dark flow page during script run",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // wait until script is done
    cy.wait(7000);

    // snap home page after script is over
    cy.eyesCheckWindow({
      tag: "dark flow page after script finishes",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page after script finishes",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Testing cancelling script
    cy.get("body").type("{ctrl}p");

    cy.get('[data-testid="btn-cancel"]').click();
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
