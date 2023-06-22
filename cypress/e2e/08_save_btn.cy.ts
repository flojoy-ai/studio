/// <reference types="cypress" />

describe("studio", () => {
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

  it("save btn test", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="btn-filebutton"]').trigger("mouseover");

    cy.get('[data-testid="btn-save"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with save btn click",
      target: "window",
      fully: true,
    });

    cy.readFile(`${Cypress.config("downloadsFolder")}/flojoy.txt`).then(
      (downloadedFile) => {
        cy.readFile(
          `${Cypress.config("downloadsFolder")}/flojoyCompare.txt`
        ).then((originalFile) => {
          expect(downloadedFile).to.equal(originalFile);
        });
      }
    );
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
