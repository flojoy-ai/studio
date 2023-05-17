import { act, renderHook } from "@testing-library/react";

import {
  CtlManifestType,
  useFlowChartState,
} from "../../hooks/useFlowChartState";

import { NOISY_SINE } from "../../data/RECIPES";

const { result, rerender } = renderHook(() => useFlowChartState());
const hookResult = result.current;

const initialManifests: CtlManifestType[] = [
  {
    type: "input",
    name: "Slider",
    id: "INPUT_PLACEHOLDER",
    hidden: false,
    minHeight: 1,
    minWidth: 2,
    layout: {
      x: 0,
      y: 0,
      h: 2,
      w: 2,
      minH: 1,
      minW: 2,
      i: "INPUT_PLACEHOLDER",
    },
  },
];

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
      ["ctrlsManifest", hookResult.ctrlsManifest, initialManifests],
      ["isEditMode", hookResult.isEditMode, false],
      ["showLogs", hookResult.showLogs, false],
      ["runningNode", hookResult.runningNode, ""],
      ["failedNode", hookResult.failedNode, ""],
    ])("%p", (description, currentResult, expectedResult) => {
      expect(currentResult).toEqual(expectedResult);
    });
  });
  // describe("loadFlowExportObject", () => {
  //   it.each([
  //     ["undefined", undefined, 0],
  //     [
  //       "not undefined",
  //       {
  //         elements: "test",
  //         position: [0, 0],
  //         zoom: 1,
  //       },
  //       0,
  //     ],
  //   ])(
  //     "given a/an %p flow object,retunrns from the function",
  //     (statement: string, input: any, expectedReturnValue) => {
  //       const spy = jest.spyOn(hookResult, "loadFlowExportObject");
  //       const func = hookResult.loadFlowExportObject;
  //       act(() => {
  //         func(input);
  //       });

  //       if (input === undefined) {
  //         expect(spy).toHaveReturnedWith(expectedReturnValue);
  //       } else {
  //         expect(spy).not.toHaveReturnedWith(expectedReturnValue);
  //       }
  //     }
  //   );
  // });
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
