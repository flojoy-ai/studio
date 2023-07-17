/// <reference types="cypress" />

require("cypress-xpath");

describe("Modify settings in control bar", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];
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

  it("setting btn test", () => {
    cy.visit("/").wait(1000);

    // Click the setting button
    cy.get('[data-testid="btn-setting"]').click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with setting modal",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    // Retrieve node delay and maximum time
    cy.get('[data-testid="settings-input"]').eq(0).clear();
    cy.get('[data-testid="settings-input"]')
      .eq(0)
      .type(0.5)
      .should("have.value", "0.50");
    cy.get('[data-testid="settings-input"]').eq(1).clear();
    cy.get('[data-testid="settings-input"]')
      .eq(1)
      .type(100)
      .should("have.value", "1000");
      cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "dark flow page with settings modal with input",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    cy.get('[data-testid="settings-close-btn"]').click();

    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="btn-setting"]').click();
    cy.percySnapshot();

    // cy.eyesCheckWindow({
    //   tag: "light flow page with setting modal",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
  });

  // // This method performs cleanup after each test.
  // afterEach(() => {
  //   // Close Eyes to tell the server it should display the results.
  //   cy.eyesClose();
  // });
});
