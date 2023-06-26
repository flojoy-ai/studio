/// <reference types="cypress" />

const layoutRegions = [
  { selector: '[data-cy="app-status"]' },
  { selector: '[data-cy="btn-play"]' },
];

require("cypress-xpath");
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
      layout: layoutRegions,
      fully: true,
    });
    // Open CTRLS
    cy.get("[data-cy='ctrls-btn']").click();

    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click add CTRLS button
    cy.get('[data-testid="add-ctrl-button"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Open Inputs
    cy.xpath("//div[contains(text(), 'Inputs')]").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar and INPUTS",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Open Continue variables
    cy.xpath("//div[contains(text(), 'Continuous Variables')]").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with add CTRLS sidebar, INPUTS and Continuous Variables",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    //Select Numeric Input
    cy.xpath("//button[.='NUMERIC_INPUT']").click();
    cy.eyesCheckWindow({
      tag: "dark flow page with NUMERIC_INPUT CTRLS open",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });
  afterEach(() => {
    cy.eyesClose();
  });
});
