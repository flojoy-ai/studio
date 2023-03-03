/* eslint-disable cypress/no-unnecessary-waiting */

describe('Load default page and switch between tabs', () => {
  it("Landing page should behave normally", () => {
    cy.visit("/").wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });;

    cy.get('[data-cy=ctrls-btn]').click()

    cy.get('[data-cy=debug-btn]').click()

    cy.get('[data-cy=script-btn]').click()
  })
})