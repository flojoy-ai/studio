/// <reference types="cypress" />
require('cypress-xpath')
describe("Opening and closing node modules", () => {
  beforeEach(() => {
    cy.viewport(1920, 1200)
    cy.eyesOpen({
      appName: "studio",
      testName: Cypress.currentTest.title,
    });
  });


  it("should open flojoy studio's main page", () => {
    cy.visit("/").wait(1000);

    cy.eyesCheckWindow({
      tag: "dark flow page",
      target: "window",
      fully: true,
    });
    // Click on added container LINSPACE
    cy.xpath("//div[contains(text(), 'LINSPACE')]").click();
    //Verify modal LINSPACE is open
    cy.get('.react-draggable').should('exist');
    cy.get('.mantine-Title-root').should('have.text', 'LINSPACE')
    cy.eyesCheckWindow({
      tag: "dark flow page with open LINSPACE container",
      target: "window",
      fully: true,
    });
    //Click close modal
    cy.get(".tabler-icon-x[width='18']").click();
    // Click on added container SINE
    cy.xpath("//div[contains(text(), 'SINE')]").click();
    //Verify modal SINE is open
    cy.get('.react-draggable').should('exist');
    cy.get('.mantine-Title-root').should('have.text', 'SINE')
    cy.eyesCheckWindow({
      tag: "dark flow page with open SINE container",
      target: "window",
      fully: true,
    });
    //Click close modal
    cy.get(".tabler-icon-x[width='18']").click();
    // Click on added container 2.0
    cy.xpath("//div[contains(text(), '2.0')]").click();
    //Verify modal CONSTANT is open
    cy.get('.react-draggable').should('exist');
    cy.get('.mantine-Title-root').should('have.text', 'CONSTANT')
    cy.eyesCheckWindow({
      tag: "dark flow page with open LINSPACE container",
      target: "window",
      fully: true,
    });
    //Click close container
    cy.get(".tabler-icon-x[width='18']").click();
  });
  afterEach(() => {
    cy.eyesClose();
  });
});
