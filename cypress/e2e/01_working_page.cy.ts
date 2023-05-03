/* eslint-disable cypress/no-unnecessary-waiting */

describe("Load default page and switch between tabs", () => {
  it("Landing page should behave normally", () => {
    cy.visit("/");
    cy.get("[data-testid=react-flow]", { timeout: 20000 });

    cy.get("[data-cy=ctrls-btn]")
      .click()
      .should("have.css", "border-bottom", "1px solid rgb(153, 245, 255)");

    cy.get("[data-cy=debug-btn]")
      .click()
      .should("have.css", "border-bottom", "1px solid rgb(153, 245, 255)");

    cy.get("[data-cy=script-btn]")
      .click()
      .should("have.css", "border-bottom", "1px solid rgb(153, 245, 255)");
  });
});

export {};
