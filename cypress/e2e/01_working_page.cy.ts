/* eslint-disable cypress/no-unnecessary-waiting */

describe('Load default page and switch between tabs', () => {
  it("Should load default flow chart", () => {
    cy.visit("/").wait(10000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });;
  });
  it('visit CTRLS page', () => {
    cy.get('[data-cy=ctrls-btn]').click()
  })
  it('visit DEBUG page', () => {
    cy.get('[data-cy=debug-btn]').click()
  })
  it('visit SCRIPT page', () => {
    cy.get('[data-cy=script-btn]').click()
  })
})