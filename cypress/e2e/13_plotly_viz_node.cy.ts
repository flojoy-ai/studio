/// <reference types="cypress" />

require("cypress-xpath");

//** Captures all plotly component nodes in light/dark mode.*/

describe("Set plotly node visual tests", () => {
  it("plotly nodes visual test", () => {
    cy.visit("/").wait(1000);

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();
    //Select container Visualizers
    cy.xpath("//div[contains(text(), 'Visualizers')]").click();

    // get all viz nodes
    cy.xpath("//button[.='SCATTER3D']").click();
    cy.xpath("//button[.='LINE']").click();
    cy.xpath("//button[.='HISTOGRAM']").click();
    cy.xpath("//button[.='IMAGE']").click();
    cy.xpath("//button[.='COMPOSITE']").click();
    cy.xpath("//button[.='BAR']").click();
    cy.xpath("//button[.='BIG_NUMBER']").click();
    cy.xpath("//button[.='SURFACE3D']").click();
    cy.xpath("//button[.='PROPHET_PLOT']").click();
    cy.xpath("//button[.='SCATTER']").click();
    cy.xpath("//button[.='PROPHET_COMPONENTS']").click();
    cy.xpath("//button[.='TABLE']").click();
    cy.xpath("//button[.='MATRIX_VIEW']").click();
    cy.xpath("//button[.='ARRAY_VIEW']").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page with Scatter3d node",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Switch to light mode
    cy.get('[data-testid="darkmode-toggle"]').click();
    cy.percySnapshot();
    // cy.eyesCheckWindow({
    //   tag: "light flow page with Scatter3d node",
    //   target: "window",
    //   layout: layoutRegions,
    //   fully: true,
    // });
  });
});
