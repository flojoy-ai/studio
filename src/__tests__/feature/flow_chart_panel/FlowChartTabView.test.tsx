import { render, fireEvent, screen } from "@testing-library/react";
import { expect, jest, it, beforeEach } from "@jest/globals";
import renderer from "react-test-renderer";
import FlowChartTab from "@src/feature/flow_chart_panel/FlowChartTabView";
import NodeModal from "../../../feature/flow_chart_panel/views/NodeModal";

const results = {
  io: [
    {
      cmd: "RAND",
      id: "RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71",
      result: {
        type: "ordered_pair",
        x: [1, 2, 3],
        y: [1, 2, 3],
      },
      additional_info: {},
    },
  ],
};

const theme = "dark";
const rfInstance = {
  nodes: [
    {
      width: 150,
      height: 135,
      id: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      type: "default",
      data: {
        id: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
        label: "Linspace",
        func: "LINSPACE",
        type: "SIMULATION",
        ctrls: {
          LINSPACE_Linspace_start: {
            functionName: "LINSPACE",
            param: "start",
            value: "10",
          },
          LINSPACE_Linspace_end: {
            functionName: "LINSPACE",
            param: "end",
            value: "0",
          },
          LINSPACE_Linspace_step: {
            functionName: "LINSPACE",
            param: "step",
            value: "1000",
          },
        },
      },
      position: {
        x: -13.97018918355137,
        y: 329.3798744949378,
      },
      selected: false,
      positionAbsolute: {
        x: -13.97018918355137,
        y: 329.3798744949378,
      },
      dragging: true,
    },
  ],
  edges: [
    {
      source: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      sourceHandle: "main",
      target: "SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071",
      targetHandle: "SINE",
      id: "reactflow__edge-LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8amain-SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071SINE",
    },
  ],
  viewport: {
    x: 397.83556118085664,
    y: -52.91013934341669,
    zoom: 0.7628341009366061,
  },
};

const clickedElement = undefined;
const setClickedElement = jest.fn();
const setRfInstance = jest.fn();

jest.mock("../../../feature/flow_chart_panel/views/NodeModal", () => (
  <div></div>
));

describe("FlowChartTabView", () => {
  describe("component should render correctly", () => {
    it("should match snapshot", () => {
      const tree = renderer
        .create(
          <FlowChartTab
            results={results}
            theme={theme}
            rfInstance={rfInstance}
            clickedElement={clickedElement}
            setClickedElement={setClickedElement}
            setRfInstance={setRfInstance}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
