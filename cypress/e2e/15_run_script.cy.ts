/// <reference types="cypress" />

//** Tests script run/cancellation for default app and captures the results as snapshots in light/dark mode.*/

describe("playing script", () => {
  it("script test on main page", () => {
    cy.visit("/").wait(1000);

    //click on play button
    cy.get('[data-cy="btn-play"]').click();
    cy.percySnapshot();
    // // snap home page during script play
    // cy.eyesCheckWindow({
    //   tag: "dark flow page during script run",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    // wait until script is done
    cy.wait(7000);
    cy.percySnapshot();
    // snap home page after script is over
    // cy.eyesCheckWindow({
    //   tag: "dark flow page after script finishes",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "light flow page after script finishes",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });

    // Testing cancelling script (ctrl + p)
    cy.get("body").type("{ctrl}p");
    cy.get('[data-cy="btn-cancel"]').click();

    cy.wait(5000);

    // Testing cancelling script (meta + p)
    cy.get("body").type("{meta}p");
    cy.get('[data-cy="btn-cancel"]').click();
  });
});
