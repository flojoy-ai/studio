import { act, renderHook } from "@testing-library/react-hooks";

import { PlotControlProps } from "@src/feature/controls_panel/views/PlotControl";
import {
  ResultIO,
  ResultsType,
} from "@src/feature/results_panel/types/ResultsType";
import {
  NodeInputOptions,
  PlotControlOptions,
} from "@src/feature/controls_panel/types/ControlOptions";

import PlotControlState from "@src/feature/controls_panel/views/PlotControlState";

const testPlotControlProps: PlotControlProps = {
  nd: null,
  setNd: (value: React.SetStateAction<ResultIO | null>) => {},
  ctrlObj: {
    id: "plot-control",
    name: "Plot Control",
    type: "plot",
    minHeight: 10,
    minWidth: 10,
    layout: { i: "asd", x: 34, y: 34, w: 23, h: 3 },
  },
  results: {
    io: [
      {
        cmd: "string",
        id: "string",
        result: {
          type: "bar",
          file_type: ["string[]"],
          source: "string",
          x: undefined,
          y: undefined,
          z: undefined,
          layout: undefined,
          data: [
            {
              x: [2, 4, 5, 6],
              y: [2, 4, 5, 6],
              z: [2, 4, 5, 6],
              type: "box",
              mode: "lines",
            },
          ],
        },
      },
    ],
  } as ResultsType,
  isEditMode: true,
  selectedOption: { value: "line", label: "Line" },
  theme: "dark",
  selectedPlotOption: undefined,
  setSelectedPlotOption: (
    value: React.SetStateAction<PlotControlOptions | undefined>
  ) => {},
  plotData: [
    {
      x: [1, 2, 3],
      y: [4, 5, 6],
      z: [7, 8, 9],
      source: "example",
      type: "scatter3d",
      mode: "lines",
    },
  ],
  setPlotData: () => [
    {
      x: [10, 11, 12],
      y: [13, 14, 15],
      z: [16, 17, 18],
      source: "example",
      type: "scatter3d",
      mode: "lines",
    },
  ],
};

describe("Testing PlotControl States", () => {
  describe("Testing PlotControlState's InputOptions State", () => {
    it("Checks if the InputOptions State renders with default State", () => {
      const { result } = renderHook(() =>
        PlotControlState(testPlotControlProps)
      );
      expect(result.current.inputOptions).toEqual([]);
    });

    it("Checks if the InputOptions State renders/fires with Updated State", () => {
      const testInputOptions: NodeInputOptions[] = [
        {
          label: "My chart",
          value: testPlotControlProps?.results?.io?.[0]?.result,
        },
      ];

      const { result } = renderHook(() =>
        PlotControlState(testPlotControlProps)
      );
      act(() => result.current.setInputOptions(testInputOptions));

      expect(result.current.inputOptions).toBe(testInputOptions);
    });
  });

  describe("Testing PlotControlState's PlotOptions State", () => {
    it("Checks if the PlotOptions State renders with default State", () => {
      const {
        result: { current },
      } = renderHook(() => PlotControlState(testPlotControlProps));
      expect(current.plotOptions).toEqual([]);
    });

    it("Checks if the PlotOptions's State renders/fires with Updated State", () => {
      const testPlotOptions: PlotControlOptions[] = [
        {
          label: "string",
          value: {
            id: "3",
            type: "bar",
            mode: "lines",
          },
        },
      ];

      const { result } = renderHook(() =>
        PlotControlState(testPlotControlProps)
      );
      act(() => result.current.setPlotOptions(testPlotOptions));

      expect(result.current.plotOptions).toBe(testPlotOptions);
    });
  });

  describe("Testing PlotControlState's SelectedKeys State", () => {
    it("Checks if the SelectedKeys State renders with default State", () => {
      const {
        result: { current },
      } = renderHook(() => PlotControlState(testPlotControlProps));
      expect(current.selectedKeys).toBeNull();
    });

    it("Checks if the SelectedKeys's State renders/fires with Updated State", () => {
      const testSelectedKeys: Record<string, any> | null = {
        label: "string",
        id: 3,
        value: [
          {
            id: "3",
            type: "bar",
            mode: "lines",
          },
        ],
      };

      const { result } = renderHook(() =>
        PlotControlState(testPlotControlProps)
      );
      act(() => result.current.setSelectedKeys(testSelectedKeys));

      expect(result.current.selectedKeys).toBe(testSelectedKeys);
    });
  });

  describe("Should Render PlotControlState with Passed Arguments and Return Them ", () => {
    const {
      result: { current },
    } = renderHook(() => PlotControlState(testPlotControlProps));
    it.each([
      [current.ctrlObj, testPlotControlProps.ctrlObj],
      [current.nd, testPlotControlProps.nd],
      [current.setNd, testPlotControlProps.setNd],
      [current.results, testPlotControlProps.results],
      [current.selectedOption, testPlotControlProps.selectedOption],
      [current.selectedPlotOption, testPlotControlProps.selectedPlotOption],
      [current.setPlotData, testPlotControlProps.setPlotData],
    ])(
      "%o should should Return %o from the passed Arguments of the Rendered Hook",
      (inputTest, expectedReturnValue) => {
        expect(inputTest).toBe(expectedReturnValue);
      }
    );
  });
});
