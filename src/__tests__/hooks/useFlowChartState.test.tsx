import { expect, jest, it } from "@jest/globals";
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
      ["elements", hookResult.elements, NOISY_SINE.elements],
      [
        "rfSpatialInfo",
        hookResult.rfSpatialInfo,
        {
          x: 0,
          y: 0,
          zoom: 1,
        },
      ],
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
    it("given a flow object,calls saveFile mock", () => {
      const testElement: any = {
        elements: "sting",
      };
      const spy = jest.spyOn(FileSaver, "saveAs");
      const setRfInstance = hookResult.setRfInstance;

      act(() => {
        setRfInstance(testElement);
      });

      rerender();

      result.current.saveFile();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
