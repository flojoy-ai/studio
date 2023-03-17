import React from "react";

const ReactFlow = jest.fn().mockReturnValue(<div data-testid="react-flow" />);
const ReactFlowProvider = jest
  .fn()
  .mockImplementation(({ children }) => (
    <div data-testid="react-flow-provider">{children}</div>
  ));
const EdgeTypes = { default: jest.fn() };
const NodeTypes = { default: jest.fn() };
const OnInit = jest.fn();

const returnValues = {
  ReactFlowProvider,
  EdgeTypes,
  NodeTypes,
  ConnectionLineType: {
    Bezier: "default",
    Straight: "straight",
    Step: "step",
    SmoothStep: "smoothstep",
    SimpleBezier: "simplebezier",
  },
  OnInit,
  ReactFlow,
};

module.exports = returnValues;
