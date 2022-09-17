describe('user workflow', ()=> {
    beforeEach(()=>{
        cy.visit('/')
    });
   
    it('Flow chart should be loaded.', () => {
        cy.get('.react-flow');
      })

    it('Default nodes should be in flow chart', ()=>{
        cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').contains('div', 'LINSPACE')
    })

    it('Switch to ctrls tab upon clicking on CTRLS.',()=>{
        cy.get('a').contains('CTRLS').click().should('have.class', 'active-dark')
    })
    it('Enables operation mode upon clicking edit switch button.',()=>{
        cy.get('a').contains('CTRLS').click();
        cy.get('[data-cy=operation-switch]').contains('Edit').click().should('have.css','color','rgb(255, 165, 0)')
        cy.get('.ctrl-input')
    })

   
})