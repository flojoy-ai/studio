/// <reference types="cypress" />
// At the top of cypress/support/commands.js

describe("main page", () => {
  // // This method performs setup before each test.
  // beforeEach(() => {
  //   // Open Eyes to start visual testing.
  //   // Each test should open its own Eyes for its own snapshots.
  //   cy.eyesOpen({
  //     // The name of the application under test.
  //     // All tests for the same app should share the same app name.
  //     // Set this name wisely: Applitools features rely on a shared app name across tests.
  //     appName: "studio",

  //     // The name of the test case for the given application.
  //     // Additional unique characteristics of the test may also be specified as part of the test name,
  //     // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
  //     testName: Cypress.currentTest.title,
  //   });
  // });

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.
  it("main page", () => {
    cy.visit("/").wait(1000);

    cy.percySnapshot();

    // This nodeid value is from src/data/RECIPES.ts
    cy.get(
      '[data-testid="rf__node-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd"]'
    ).click();

    cy.percySnapshot();

    // Click add new node button
    cy.get('[data-testid="add-node-button"]').click();
    cy.percySnapshot();

    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot();
  });

  // // This method performs cleanup after each test.
  // afterEach(() => {
  //   // Close Eyes to tell the server it should display the results.
  //   cy.eyesClose();
  // });
});
