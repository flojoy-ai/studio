/// <reference types="cypress" />

describe("studio", () => {
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

  it("aws s3 key test", () => {
    cy.visit("/").wait(1000);

    // Hover file button
    cy.get('[data-testid="file-btn"]').trigger("mouseover");

    // Select Set S3 Key option
    cy.get('[data-testid="btn-s3key"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with AWS S3 key modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Input for S3 Key
    cy.get('[data-testid="s3_name_input"]').type("TestS3Name");
    cy.get('[data-testid="s3_access_input"]').type("TestS3AccessKey");
    cy.get('[data-testid="s3_secret_input"]').type("TestS3SecretKey");

    // Click submit button
    cy.get('[data-testid="s3-submit-btn"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with AWS S3 key modal submit",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="s3-close-btn"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with AWS S3 key modal closed",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Switch to light mode and test the same thing
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="file-btn"]').trigger("mouseover");

    cy.get('[data-testid="btn-s3key"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with AWS S3 key modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="s3_name_input"]').type("TestS3Name");
    cy.get('[data-testid="s3_access_input"]').type("TestS3AccessKey");
    cy.get('[data-testid="s3_secret_input"]').type("TestS3SecretKey");

    cy.get('[data-testid="s3-submit-btn"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with AWS S3 key modal submit",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="s3-close-btn"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with AWS S3 key modal closed",
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
