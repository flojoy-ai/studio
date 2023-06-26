/// <reference types="cypress" />

const layoutRegions = [
  { selector: '[data-cy="app-status"]' },
  { selector: '[data-cy="btn-play"]' },
];

require("cypress-xpath");
describe(" node", () => {
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
    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    // Click request node
    cy.get('[data-testid="request-node-btn"]').click();

    cy.eyesCheckWindow({
      tag: "new page with node request form",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
