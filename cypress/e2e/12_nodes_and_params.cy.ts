/// <reference types="cypress" />
require("cypress-xpath");

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

  it("testing nodes and its parameters", () => {
    cy.visit("/").wait(1000);

    // Click clear canvas button
    cy.get(
      '[data-testid="rf__node-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd"]'
    ).click();
    // Check if there are 5 parameters for SINE node
    cy.get('[data-testid="node-edit-modal-params"]').should("have.length", 5);
    // Modify float parameters
    cy.get('[data-testid="float-input"]').each(($element) => {
      cy.get($element).type("{selectall}{backspace}");
      cy.get($element).type(3).should("have.value", 3);
    });
    // Modify select parameters
    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", "square").click();
      cy.get($element).should("have.value", "square");
    });
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();


    // Click clear canvas button
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="add-node-button"]').click();
    // Add ARGRELMAX node
    cy.get('[data-testid="sidebar-input"]').type("argrelmax");
    cy.get("button").contains("ARGRELMAX").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="data-label-design"]').contains("ARGRELMAX").click();
    // Modify int parameters
    cy.get('[data-testid="int-input"]').each(($element) => {
      cy.get($element).type("{selectall}{backspace}");
      cy.get($element).type(3).should("have.value", 3);
    });
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();


    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box and add OPEN_IMAGE node
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("open");
    cy.get("button").contains("OPEN_IMAGE").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').click();
    // Modify string parameter
    cy.get('[data-testid="string-input"]').each(($element) => {
      cy.get($element).type("{selectall}{backspace}");
      cy.get($element).type("image path").should("have.value", "image path");
    });
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();


    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("fft");
    // Add FFT node
    cy.get("button").contains("FFT").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').click();
    // Modify boolean parameter
    cy.get('[data-cy="boolean-input"]').click({ multiple: true });
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();


    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("extract");
    // Add EXTRACT_COLUMN node
    cy.get("button").contains("EXTRACT_COLUMN").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').click();
    // Modify array parameter
    cy.get('[data-testid="array-input"]')
      .type("[1,2,3,4]")
      .should("have.value", "[1,2,3,4]");
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();


    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("feedback");
    // Add FEEDBACK node
    cy.get("button").contains("FEEDBACK").click();
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("linspace");
    // Add LINSPACE node
    cy.get("button").contains("LINSPACE").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]')
      .contains("FEEDBACK")
      .click({ multiple: true });
    // Modify node_reference parameter
    cy.get('[data-testid="node_reference-input"]').each(($element) => {
      cy.get($element).click();
      cy.get('[data-testid="node-edit-modal-params"]')
        .contains("LINSPACE")
        .click();
      cy.get($element).should("have.value", "LINSPACE");
    });
    // Light mode / Dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();


    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();
    // GET ALL CUSTOM NODES
    // conditional node
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.contains("button", "CONDITIONAL").click();
    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="data-label-design"]').contains("CONDITIONAL").click();
    // check if selected operator is displayed on node box
    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", ">").click();
    });
    cy.get('[data-testid="conditional-operator-type"]').and(($div) => {
      expect($div.text()).to.contain(">");
    });
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();
    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="darkmode-toggle"]').click();

    // creating loop node
    cy.get('[data-testid="add-node-button"]').click();
    // cy.xpath("//div[contains(text(), 'Logic gates')]").click();
    cy.contains("button", "LOOP").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.xpath("//div[contains(text(), 'LOOP')]").click();
    cy.get('[data-testid="node-wrapper"]');
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(10);
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();
    // Switch to dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    // creating numpy node
    cy.get('[data-testid="add-node-button"]').click();
    cy.get('[data-testid="sidebar-input"]').type("tensorinv");
    cy.contains("button", "TENSORINV").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="data-label-design"]').contains("TENSORINV").click();
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(2);
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    cy.get('[data-testid="darkmode-toggle"]').click();
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
