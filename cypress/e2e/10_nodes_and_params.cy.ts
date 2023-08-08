/// <reference types="cypress" />
require("cypress-xpath");

describe("Verify nodes and its parameters", () => {
  it("testing nodes and its parameters", () => {
    cy.visit("/").wait(1000);

    // Click clear canvas button
    cy.get(
      '[data-testid="rf__node-SINE-b3fe92c7-36bf-4869-b25b-51c86b125e08"]'
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
    cy.get('[data-testid="sidebar-input"]').type("bspline");
    cy.get("button").contains("BSPLINE").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').contains("BSPLINE").click();
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
    cy.get('[data-testid="object-input"]').each(($element) => {
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
    cy.get('[data-testid="boolean-input"]').click({
      multiple: true,
      force: true,
    });
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
    cy.get('[data-testid="object-input"]')
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
      .click({ multiple: true, force: true });
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
    cy.get('[data-testid="sidebar-input"]').type("conditional");
    cy.contains("button", /^CONDITIONAL$/).click();
    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').click();
    // check if selected operator is displayed on node box
    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", ">").click();
      cy.get($element).should("have.value", ">");
    });

    cy.get('[data-testid="node-edit-modal-close-btn"]').click();
    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="clear-canvas-button"]').click();
    cy.get('[data-testid="darkmode-toggle"]').click();

    // creating loop node
    cy.get('[data-testid="add-node-button"]').click();
    // Clear input box
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("loop");
    cy.contains("button", /^LOOP$/).click();
    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').click();
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(10);

    cy.get('[data-testid="node-edit-modal-close-btn"]').click();
    cy.get('[data-testid="clear-canvas-button"]').click();
    // Switch to dark mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    // creating numpy node
    cy.get('[data-testid="add-node-button"]').click();
    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");
    cy.get('[data-testid="sidebar-input"]').type("tensorinv");
    cy.contains("button", "TENSORINV").click();
    cy.get('[data-testid="sidebar-close"]').click();
    cy.get('[data-testid="node-wrapper"]').click();
    cy.get('[data-testid="int-input"]').eq(0).type("{selectall}{backspace}");
    cy.get('[data-testid="int-input"]').eq(0).type(2);
    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    cy.get('[data-testid="darkmode-toggle"]').click();
  });
});
