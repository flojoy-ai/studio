
/// <reference types="cypress" />
describe( "useControlsTabEffects", () => {
  it( "should update ctrlsManifest when nodes length is 0", () => {
    cy.visit( "/controls" ).wait( 3000 );// Assuming you have a web application to test

    cy.intercept( "GET", "../../src/hooks/useFlowChartState", {
      fixture: "useFlowChartStateFixture.json", // Replace with actual fixture data
    } );

    cy.intercept( "GET", "../../src/hooks/useFlowChartGraph", {
      fixture: "useFlowChartGraphFixture.json", // Replace with actual fixture data
    } );

    // Wait for the data to be loaded and rendered
    cy.wait( "@useFlowChartState" );
    cy.wait( "@useFlowChartGraph" );

    // Assert initial state before useEffect is triggered
    cy.get( "@setCtrlsManifest" ).should( "not.be.called" );

    // Trigger useEffect by performing an action that changes nodes length to 0
    // e.g., delete all nodes from the UI

    // Wait for the useEffect to be triggered and assert the updated state
    cy.get( "@setCtrlsManifest" ).should( "be.calledWith", [] );

    // Additional assertions if necessary
  } );
} );

