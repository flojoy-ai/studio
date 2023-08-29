/// <reference types="cypress" />

//** Tests whether flowchart cancels normally after run for default app and captures the results as snapshots in light/dark mode.*/

describe("Testing flowchart cancel", () => {
  it("flowchart cancel test on default app", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    //click on play button
    cy.get('[data-cy="btn-play"]').click();
    cy.get('[data-cy="btn-cancel"]').click();

    // center screen
    cy.wait(1000).get('[data-testid="react-flow"]').trigger("keydown", {
      key: "1",
      metaKey: true,
    });
    cy.percySnapshot("dark flow page after flowchart runs");

    cy.wait(2000).get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot("light flow page after flowchart runs");
  });
});
