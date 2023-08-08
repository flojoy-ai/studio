/// <reference types="cypress" />

//** Tests app gallery feature.*/

describe("Shortcut test", () => {
    it("Shortcut test", () => {
      cy.visit("/").wait(1000);
  
      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: 'a',
        metaKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: 'a',
        ctrlKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: '0',
        metaKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: '0',
        ctrlKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: 'a',
        metaKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: '9',
        ctrlKey: true
      });

      cy.get('[data-testid="react-flow"]').trigger('keydown', {
        key: '9',
        metaKey: true
      });

    });
  });
