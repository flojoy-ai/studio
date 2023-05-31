/// <reference types="cypress" />

describe("useControlsTabEffects", () => {
  before(() => {
    cy.eyesOpen({
      appName: "test app ",
      testName: "useControlsTabEffects Test",
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.eyesCheckWindow("Initial Render");
  });

  after(() => {
    cy.eyesClose();
  });

  it("should set controls manifest to empty array when rfInstance nodes length is 0", () => {
    // Stub the useFlowChartState hook
    cy.stub(window, "useFlowChartState").returns({
      setCtrlsManifest: cy.stub().as("setCtrlsManifest"),
      rfInstance: {
        nodes: [],
      },
    });

    // Mount the component that uses the useControlsTabEffects hook
    cy.visit("your_component_url"); // Replace 'your_component_url' with the URL of the component that uses the hook

    // Check if setCtrlsManifest was called with an empty array
    cy.get("@setCtrlsManifest").should("have.been.calledOnceWith", []);

    // Visual validation using Applitools
    cy.eyesCheckWindow("Empty Controls Manifest");
  });
});
