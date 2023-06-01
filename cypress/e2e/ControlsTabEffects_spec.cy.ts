/// <reference types="cypress" />

import { useControlsTabEffects } from "../../src/feature/controls_panel/ControlsTabEffects";

describe( "useControlsTabEffects", () => {
  beforeEach( () => {
    cy.eyesOpen( {
      appName: 'Studio',
      testName: 'useControlsTabEffects Test',
    } )
  } );

  afterEach( () => {
    cy.eyesClose()
  } );

  it( "should call setCtrlsManifest with an empty array when nodes length is 0", () => {
    const setCtrlsManifestSpy = cy.spy();

    cy.stub( useControlsTabEffects ).returns( {
      setCtrlsManifest: setCtrlsManifestSpy,
    } );
    cy.stub( useControlsTabEffects ).returns( {
      nodes: [],
    } );

    cy.mount( () => useControlsTabEffects() );

    cy.wrap( setCtrlsManifestSpy ).should( "be.calledWith", [] );

    cy.eyesCheckWindow( {
      tag: "Empty nodes",
      target: "window",
      fully: true,
    } );
  } );

  it( "should not call setCtrlsManifest when nodes length is not 0", () => {
    const setCtrlsManifestSpy = cy.spy();

    cy.stub( useControlsTabEffects ).returns( {
      setCtrlsManifest: setCtrlsManifestSpy,
    } );
    cy.stub( useControlsTabEffects, ).returns( {
      nodes: [ { id: 1 } ],
    } );

    cy.mount( () => useControlsTabEffects() );

    cy.wrap( setCtrlsManifestSpy ).should( "not.be.called" );

    cy.eyesCheckWindow( {
      tag: "Non-empty nodes",
      target: "window",
      fully: true,
    } );
  } );
} );
