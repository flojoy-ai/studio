/// <reference types="cypress" />

//** Tests script run/cancellation for default app and captures the results as snapshots in light/dark mode.*/

describe("playing script", () => {
  it("script test on main page", () => {
    cy.visit("/").wait(1000);

    //click on play button
    cy.get('[data-cy="btn-play"]').click();
    cy.percySnapshot("dark flow page during script run");
    // // snap home page during script play

    // wait until script is done
    cy.wait(7000);
    cy.percySnapshot("dark flow page after script finishes");

    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot("light flow page after script finishes");

    // Testing cancelling script (ctrl + p)
    cy.get("body").type("{ctrl}p");
    cy.get('[data-cy="btn-cancel"]').click();

    cy.wait(5000);

    // Testing cancelling script (meta + p)
    cy.get("body").type("{meta}p");
    cy.get('[data-cy="btn-cancel"]').click();
  });
});
