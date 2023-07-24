/// <reference types="cypress" />

require("cypress-xpath");

describe("Modify settings in control bar", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("setting btn test", () => {
    cy.visit("/").wait(1000);

    // Click the setting button
    cy.get('[data-testid="btn-setting"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with setting modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

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

    cy.eyesCheckWindow({
      tag: "dark flow page with settings modal with input",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    cy.get('[data-testid="settings-close-btn"]').click();

    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="btn-setting"]').click();

    cy.eyesCheckWindow({
      tag: "light flow page with setting modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });
});
