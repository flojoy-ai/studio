// describe('flow chart', () => {
//   beforeEach(()=>{
//     cy.visitHomepage()
//   })
//   it('Flow chart should be loaded.', () => {
//     cy.get('.react-flow');
//   });
//   it('Linspace node should be in the flow chart', ()=>{
//     cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').contains('div', 'LINSPACE')
//   })
//   it('should open modal with node details on clicking upon a node.', ()=>{
//     cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').click();
//     cy.contains('h1', 'LINSPACE')
//   })
//   it('Should open modal on clicking upon add a node.', (done)=>{
//     cy.get('[data-cy=add-node]').click();
//     cy.contains('p', 'Generators')
//     cy.get('button').contains('Constant').click();
//     setTimeout(done,5000);
//   })
// })