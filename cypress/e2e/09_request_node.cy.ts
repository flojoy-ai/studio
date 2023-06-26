/// <reference types="cypress" />
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
      fully: true,
    });
    // Click add node
    cy.get('[data-testid="add-node-button"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with add node sidebar",
      target: "window",
      fully: true,
    });
    // Click request node
    cy.get('[data-testid="request-node-btn"]').click();
    cy.eyesCheckWindow({
      tag: "new page with node request form",
      target: "window",
      fully: true,
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
