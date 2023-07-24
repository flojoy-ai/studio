/// <reference types="cypress" />

//** Tests basic toggle functionality for dropdown menu and captures the results as snapshots in light/dark mode.*/

describe("Verify drop down button", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("drop down wrapper", () => {
    cy.visit("/").wait(1000);

    //test dark mode
    cy.get('[data-testid="dropdown-wrapper"]').trigger("mouseover");
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "dark flow page with dropdown bar",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    cy.get('[data-testid="dropdown-wrapper"]', { timeout: 1000 }).trigger(
      "mouseout"
    );

    cy.get('[data-testid="darkmode-toggle"]').click();

    // test light mode
    cy.get('[data-testid="dropdown-wrapper"]').trigger("mouseover");
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "light flow page with dropdown bar",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    cy.get('[data-testid="dropdown-wrapper"]', { timeout: 1000 }).trigger(
      "mouseout"
    );
  });
});
