describe('Script Tab Functionalities', () => {
  it("Should load default flow chart", () => {
    cy.visit("/").wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });;
  });
  it('Linspace node should be in the flow chart', ()=>{
    cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').within(($ele) => {
      cy.wrap($ele).contains('LINSPACE', {matchCase : false});
    });
  })
  it('Should open modal with node details on clicking upon a node.', ()=>{
    cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').click();
    cy.contains('h1', 'LINSPACE', {matchCase: false})
  })
})