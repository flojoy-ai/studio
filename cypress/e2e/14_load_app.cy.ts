/// <reference types="cypress" />

//** Tests loading an app.*/

describe("Loading an app", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("Can load app correctly", () => {
    cy.visit("/").wait(1000);

    //test dark mode
    cy.get('[data-testid="dropdown-button"]').click({ force: true });

    cy.get('[id="load-app-btn"]').click({ force: true });
    cy.get("body")
      .get("input[type=file]")
      .selectFile("cypress/fixtures/load_test.txt", { force: true });

    cy.percySnapshot("Flow page after loading app");

    cy.get('[data-testid="node-wrapper"]').should("have.length", 1);
  });
});
