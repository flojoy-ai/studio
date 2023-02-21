import { expect, jest, it, beforeEach } from "@jest/globals";
import { act, renderHook, Renderer } from "@testing-library/react-hooks";

import { useFlowChartState } from "../../hooks/useFlowChartState";

import { NOISY_SINE } from "../../data/RECIPES";
import * as FileSaver from "file-saver";

const initialManifests: any = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight: 1,
    minWidth: 2,
  },
];
const { result, rerender } = renderHook(() => useFlowChartState());
const hookResult = result.current;

jest.mock("use-file-picker", () => {
  return {
    useFilePicker: jest.fn().mockReturnValue([
      jest.fn(),
      {
        filesContent: [
          {
            content: JSON.stringify({
              ctrlsManifest: initialManifests,
              rfInstance: undefined,
              gridLayout: [
                {
                  w: 2,
                  h: 2,
                  x: 0,
                  y: 2,
                  i: "ctrl-3280c18b-84d7-4f72-a6ab-5b4721123c92",
                  minW: 1,
                  minH: 1,
                  moved: false,
                  static: false,
                },
              ],
            }),
          },
        ],
        plainFiles: [new File([], "image.jpg")],
        errors: [],
        loading: false,
        clear: jest.fn(),
      },
    ]),
  };
});

jest.mock("file-saver", () => {
  return {
    saveAs: jest.fn(),
  };
});

describe("useFlowChartState", () => {
  describe("checking default values of states", () => {
    it.each([
      ["rfInstance", hookResult.rfInstance, undefined],
      ["ctrlsManifest", hookResult.ctrlsManifest, initialManifests],
      ["isEditMode", hookResult.isEditMode, false],
      [
        "gridLayout",
        hookResult.gridLayout,
        [
          {
            w: 2,
            h: 2,
            x: 0,
            y: 2,
            i: "ctrl-3280c18b-84d7-4f72-a6ab-5b4721123c92",
            minW: 1,
            minH: 1,
            moved: false,
            static: false,
          },
        ],
      ],
      ["uiTheme", hookResult.uiTheme, "dark"],
      ["showLogs", hookResult.showLogs, false],
      ["runningNode", hookResult.runningNode, ""],
      ["failedNode", hookResult.failedNode, ""],
    ])("%p", (description, currentResult, expectedResult) => {
      expect(currentResult).toEqual(expectedResult);
    });
  });
  describe("loadFlowExportObject", () => {
    it.each([
      ["undefined", undefined, 0],
      [
        "not undefined",
        {
          elements: "test",
          position: [0, 0],
          zoom: 1,
        },
        0,
      ],
    ])(
      "given a/an %p flow object,retunrns from the function",
      (statement: string, input: any, expectedReturnValue) => {
        const spy = jest.spyOn(hookResult, "loadFlowExportObject");
        const func = hookResult.loadFlowExportObject;
        act(() => {
          func(input);
        });

        if (input === undefined) {
          expect(spy).toHaveReturnedWith(expectedReturnValue);
        } else {
          expect(spy).not.toHaveReturnedWith(expectedReturnValue);
        }
      }
    );
  });
  describe("useFilePicker", () => {
    it("checks if useFilePicker called with right parameters", () => {
      const filesContent = hookResult.filesContent;

      expect(filesContent.length).toEqual(1);
    });
  });

  describe("saveFile", () => {
    it("given an undefined flow object,returns", async () => {
      const spy = jest.spyOn(FileSaver, "saveAs");
      hookResult.saveFile();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("updateCtrlInputDataForNode", () => {
    it("given a set of parameters, calls the setElement function", () => {
      const spy = jest.spyOn(hookResult, "setNodes");
      const testData = {
        nodeId: "2.0-userGeneratedNode_1646435677928",
        paramId: "CONSTANT_2.0_constant",
        inputData: {
          functionName: "CONSTANT",
          param: "constant",
          value: 10,
        },
      };
      act(() => {
        hookResult.setNodes(NOISY_SINE.nodes);
        hookResult.updateCtrlInputDataForNode(
          testData.nodeId,
          testData.paramId,
          testData.inputData
        );
      });
      expect(spy).toHaveBeenCalled();
    });
    it("given a node and ctrl parameter,sets value to its ctrls parameter", () => {
      const testData = {
        nodeId: "LINSPACE-userGeneratedNode_1646432683694",
        paramId: "LINSPACE_Linspace_start",
        inputData: {
          functionName: "LINSPACE",
          param: "start",
          value: 20,
        },
      };

      const expectedElements = getExpectedData(
        "LINSPACE-userGeneratedNode_1646432683694"
      );

      act(() => {
        hookResult.setNodes(NOISY_SINE.nodes);
        hookResult.updateCtrlInputDataForNode(
          testData.nodeId,
          testData.paramId,
          testData.inputData
        );
      });

      rerender();

      expect(result.current.nodes).toEqual(expectedElements);
    });
  });

  describe("removeCtrlInputDataForNode", () => {
    const spy = jest.spyOn(hookResult, "setNodes");
    act(() => {
      hookResult.setNodes(NOISY_SINE.nodes);
      hookResult.removeCtrlInputDataForNode(
        "LINSPACE-userGeneratedNode_1646432683694",
        "LINSPACE_Linspace_start"
      );
    });
    expect(spy).toHaveBeenCalled();
  });
});

const getExpectedData = (id) => {
  const returnElement = NOISY_SINE.nodes;
  return returnElement.map((element) =>
    element.id === id
      ? {
          ...element,
          data: {
            ...element.data,
            ctrls: {
              ...element.data?.ctrls,
              LINSPACE_Linspace_start: {
                functionName: "LINSPACE",
                param: "start",
                value: 20,
              },
            },
          },
        }
      : element
  );
};
