/// <reference types="cypress" />

//** Tests whether flowchart runs normally for default app and captures the results as snapshots in light/dark mode.*/

describe("Testing flowchart run", () => {
  it("flowchart run test on default app", () => {
    cy.visit("/").wait(1000);

    //click on play button
    cy.get('[data-cy="btn-play"]').click();

    // wait until play is over then center screen
    cy.wait(2000).get('[data-testid="react-flow"]').trigger("keydown", {
      key: "1",
      metaKey: true,
    });
    cy.percySnapshot("dark flow page after flowchart runs");

    cy.wait(2000).get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot("light flow page after flowchart runs");
  });
});
