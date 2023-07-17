/// <reference types="cypress" />

//** Tests script run/cancellation for default app and captures the results as snapshots in light/dark mode.*/

describe("playing script", () => {
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

  it("script test on main page", () => {
    cy.visit("/").wait(1000);

    //click on play button
    cy.get('[data-cy="btn-play"]').click();

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

    // Testing cancelling script (ctrl + p)
    cy.get("body").type("{ctrl}p");
    cy.get('[data-cy="btn-cancel"]').click();

    cy.wait(5000);

    // Testing cancelling script (meta + p)
    cy.get("body").type("{meta}p");
    cy.get('[data-cy="btn-cancel"]').click();
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
