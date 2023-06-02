import { renderHook } from "@testing-library/react";

import { useFlowChartState } from "../../hooks/useFlowChartState";

import { NOISY_SINE } from "../../data/RECIPES";

const { result } = renderHook(() => useFlowChartState());
const hookResult = result.current;

jest.mock("use-file-picker", () => {
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

describe("useFlowChartState", () => {
  describe("checking default values of states", () => {
    it.each([
      ["rfInstance", hookResult.rfInstance, undefined],
      ["isEditMode", hookResult.isEditMode, false],
      ["showLogs", hookResult.showLogs, false],
      ["runningNode", hookResult.runningNode, ""],
      ["failedNode", hookResult.failedNode, ""],
    ])("%p", (description, currentResult, expectedResult) => {
      expect(currentResult).toEqual(expectedResult);
    });
  });
  // describe("useFilePicker", () => {
  //   it("checks if useFilePicker called with right parameters", () => {
  //     const filesContent = hookResult.filesContent;

  //     expect(filesContent.length).toEqual(1);
  //   });
  // });
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
