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
    cy.get('[data-testid="settings-btn"]').click();
    cy.get('[data-testid="btn-node-settings"]').click();

    cy.percySnapshot("dark flow page with setting modal");

    // Retrieve node delay and maximum time
    cy.get('[data-testid="settings-input"]')
      .eq(0)
      .type("{selectall}{backspace}");
    cy.get('[data-testid="settings-input"]').eq(0).type(0.5);
    // .should("have.value", "0.5");
    cy.get('[data-testid="settings-input"]')
      .eq(1)
      .type("{selectall}{backspace}");
    cy.get('[data-testid="settings-input"]').eq(1).type(100);
    // .should("have.value", "1000");

    cy.percySnapshot("dark flow page with settings modal with input");

    cy.get('button:contains("x")').click({ force: true });

    //check the light mode
    cy.get('[data-testid="darkmode-toggle"]').click();

    //Click the settings btn
    cy.get('[data-testid="settings-btn"]').click();
    cy.get('[data-testid="btn-node-settings"]').click();

    cy.percySnapshot("light flow page with setting modal");
  });
});
