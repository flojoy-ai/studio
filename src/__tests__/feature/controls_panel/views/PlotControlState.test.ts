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
  // setPlotData: (prevPlotData) => [
  //   ...prevPlotData,
  //   {
  //     x: [10, 11, 12],
  //     y: [13, 14, 15],
  //     z: [16, 17, 18],
  //     source: "example",
  //     type: "scatter3d",
  //     mode: "lines",
  //   },
  // ],
  setPlotData: jest.fn(),
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

  describe("Testing PlotControlState's ctrlObj Return Values from Passed Arguments of the Rendered Hook", () => {
    const { result } = renderHook(() => PlotControlState(testPlotControlProps));
    it("CtrlObj should Return Id value from the passed Arguments of the Rendered Hook", () => {
      expect(result.current.ctrlObj.id).toBe(testPlotControlProps.ctrlObj.id);
    });
    it("CtrlObj should Return Name value from the passed Arguments of the Rendered Hook", () => {
      expect(result.current.ctrlObj.name).toBe(
        testPlotControlProps.ctrlObj.name
      );
    });
    it("CtrlObj should Return Type value from the passed Arguments of the Rendered Hook", () => {
      expect(result.current.ctrlObj.type).toBe(
        testPlotControlProps.ctrlObj.type
      );
    });
    it("CtrlObj should Return MinHeight value from the passed Arguments of the Rendered Hook", () => {
      expect(result.current.ctrlObj.minHeight).toBe(
        testPlotControlProps.ctrlObj.minHeight
      );
    });
    it("CtrlObj should Return MinWidth value from the passed Arguments of the Rendered Hook", () => {
      expect(result.current.ctrlObj.minWidth).toBe(
        testPlotControlProps.ctrlObj.minWidth
      );
    });
    describe("CtrlObj.layout should Return value from the passed Arguments of the Rendered Hook", () => {
      let layout = result.current.ctrlObj.layout;
      it("Should check that CtrlObj.layout.i Returns value from the passed Arguments of the Rendered Hook", () => {
        expect(layout.i).toBe(testPlotControlProps.ctrlObj.layout.i);
      });
      it("Should check that CtrlObj.layout.x Returns value from the passed Arguments of the Rendered Hook", () => {
        expect(layout.x).toBe(testPlotControlProps.ctrlObj.layout.x);
      });
      it("Should check that CtrlObj.layout.y Returns value from the passed Arguments of the Rendered Hook", () => {
        expect(layout.y).toBe(testPlotControlProps.ctrlObj.layout.y);
      });
      it("Should check that CtrlObj.layout.w Returns value from the passed Arguments of the Rendered Hook", () => {
        expect(layout.w).toBe(testPlotControlProps.ctrlObj.layout.w);
      });
      it("Should check that CtrlObj.layout.h Returns value from the passed Arguments of the Rendered Hook", () => {
        expect(layout.h).toBe(testPlotControlProps.ctrlObj.layout.h);
      });
    });
  });
});
