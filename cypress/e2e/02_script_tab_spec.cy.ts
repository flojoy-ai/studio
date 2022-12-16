/* eslint-disable cypress/no-unnecessary-waiting */
describe('Script Tab Functionalities', () => {
  it("check existance of a certain node in script tab", () => {
    cy.visit("/");
    cy.get("[data-testid=react-flow]", { timeout: 20000 });

    cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').within(($ele) => {
      cy.wrap($ele).contains('LINSPACE', {matchCase : false});
    });

    cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').click();
    cy.contains('h1', 'LINSPACE', {matchCase: false})
  })
})

export {}