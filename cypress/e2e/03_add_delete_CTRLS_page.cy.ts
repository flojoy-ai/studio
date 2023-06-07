/// <reference types="cypress" />
require('cypress-xpath')
describe("Verify Add and Delete CTRLS", () => {
  beforeEach(() => {
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
// Open CTRLS
    cy.get("[data-cy='ctrls-btn']").click();

    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar",
      target: "window",
      fully: true,
    });
// Click add CTRLS button
    cy.get('[data-testid="add-ctrl-button"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar",
      target: "window",
      fully: true,
    });
// Open Inputs
    cy.xpath("//div[contains(text(), 'Inputs')]").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar and INPUTS",
      target: "window",
      fully: true,
    });
// Open Continue variables
    cy.xpath("//div[contains(text(), 'Continuous Variables')]").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar, INPUTS and Continuous Variables",
      target: "window",
      fully: true,
    });
    //Select Numeric Input
    cy.xpath("//button[.='NUMERIC_INPUT']").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with NUMERIC_INPUT CTRLS open",
      target: "window",
      fully: true,
    });
  });
  afterEach(() => {
    cy.eyesClose();
  });
});
