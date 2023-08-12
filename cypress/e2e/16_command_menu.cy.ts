/// <reference types="cypress" />

//** Tests app gallery feature.*/

describe("Command test", () => {
  it("Command test", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "k",
      metaKey: true,
    });

    cy.percySnapshot("dark flow page with command bar open (meta)");
  });
});
