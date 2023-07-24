/// <reference types="cypress" />

describe("Verify Keyboard shortcut modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("keyboard shortcut test", () => {
    cy.visit("/").wait(1000);

    // Hover file button
    cy.get('[data-testid="file-btn"]').trigger("mouseover");

    // Select Keyboard shortcut option
    cy.get('[data-testid="btn-keyboardshortcut"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with keyboardshorcut modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="keyboard_shortcut-closebtn"]').click({ force: true });

    // Switch to light mode and test the same thing
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="file-btn"]').trigger("mouseover");

    cy.get('[data-testid="btn-keyboardshortcut"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with keyboardshorcut modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });
});
