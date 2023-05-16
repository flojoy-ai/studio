import { act, renderHook } from "@testing-library/react";
import {
  NodeInputOptions,
  PlotControlOptions,
} from "@src/feature/controls_panel/types/ControlOptions";

import PlotControlState from "@src/feature/controls_panel/views/PlotControlState";

describe("Testing PlotControl States", () => {
  describe("Testing PlotControlState's InputOptions State", () => {
    it("Checks if the InputOptions State renders with default State", () => {
      const { result } = renderHook(() => PlotControlState());
      expect(result.current.inputOptions).toEqual([]);
    });

    it("Checks if the InputOptions State renders/fires with Updated State", () => {
      const testInputOptions: NodeInputOptions[] = [
        {
          label: "My chart",
          value: "Some Value",
        },
      ];

      const { result } = renderHook(() => PlotControlState());
      act(() => result.current.setInputOptions(testInputOptions));

      expect(result.current.inputOptions).toBe(testInputOptions);
    });
  });

  describe("Testing PlotControlState's PlotOptions State", () => {
    it("Checks if the PlotOptions State renders with default State", () => {
      const {
        result: { current },
      } = renderHook(() => PlotControlState());
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

      const { result } = renderHook(() => PlotControlState());
      act(() => result.current.setPlotOptions(testPlotOptions));

      expect(result.current.plotOptions).toBe(testPlotOptions);
    });
  });

  describe("Testing PlotControlState's SelectedKeys State", () => {
    it("Checks if the SelectedKeys State renders with default State", () => {
      const {
        result: { current },
      } = renderHook(() => PlotControlState());
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

      const { result } = renderHook(() => PlotControlState());
      act(() => result.current.setSelectedKeys(testSelectedKeys));

      expect(result.current.selectedKeys).toBe(testSelectedKeys);
    });
  });
});
