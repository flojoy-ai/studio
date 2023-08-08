/// <reference types="cypress" />

//** Tests whether flowchart watch mode works normally during run for default app and captures the results as snapshots in light/dark mode.*/

describe("Testing flowchart watch mode", () => {
  it("flowchart watch mode test on default app", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="watch-mode-toggle"]').click();
    cy.percySnapshot("dark flow page after toggling watch mode");

    //click on play button
    cy.get('[data-cy="btn-play"]').click();

    // center screen
    cy.wait(2000).get('[data-testid="react-flow"]').trigger("keydown", {
      key: "1",
      metaKey: true,
    });

    // editing constant node value to test watch mode
    cy.get(
      '[data-testid="rf__node-CONSTANT-07f3a246-5fac-45ef-941f-91e41f8b7e11"]'
    ).click();
    cy.percySnapshot("dark flow page with CONSTANT menu");
    cy.get('[data-testid="float-input"]')
      .eq(0)
      .type("{selectall}{backspace}")
      .type(10);

    cy.percySnapshot("dark flow page after modifying a parameter in watch mode");

    cy.wait(2000).get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot("light flow page after flowchart runs");
  });
});
