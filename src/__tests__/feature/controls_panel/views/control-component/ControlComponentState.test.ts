import { DEFAULT_THEME } from "@mantine/styles";
import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { darkTheme } from "@src/feature/common/theme";
import {
  ControlOptions,
  PlotControlOptions,
} from "@src/feature/controls_panel/types/ControlOptions";
import ControlComponentState, {
  ControlComponentStateProps,
} from "@src/feature/controls_panel/views/control-component/ControlComponentState";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import { act, renderHook } from "@testing-library/react";

jest.mock("@src/hooks/useFlowChartState");
jest.mock("@src/data/manifests-latest.json", () => {
  return {
    __esModule: true,
    default: {
      commands: [],
      parameters: {},
    },
  };
});

jest.mock("@mantine/styles", () => ({
  useMantineColorScheme: jest.fn(() => ({ colorScheme: "dark" })),
  useMantineTheme: jest.fn(() => ({
    ...DEFAULT_THEME,
    ...darkTheme,
  })),
}));

const testControlComponentProps: ControlComponentStateProps = {
  updateCtrlValue: "myUpdatedValue",
  ctrlObj: {
    id: "plot-control",
    name: "Plot Control",
    type: "plot",
    minHeight: 10,
    minWidth: 10,
    layout: { i: "asd", x: 34, y: 34, w: 23, h: 3 },
    val: 30,
  },
};

const testSelectOptions: ControlOptions = {
  label: "string",
  value: {
    id: "string",
    functionName: "string",
    param: "string",
    nodeId: "string",
    inputId: "string",
    type: "bar",
    mode: "lines",
  },
  type: "bar",
  mode: "lines",
};

const testSelectedPlotOption: PlotControlOptions = {
  label: "string",
  value: {
    id: "string",
    type: "bar",
    mode: "lines",
  },
};

describe("Testing ControlComponentState State's", () => {
  describe("Testing ControlComponentState SelectOptions State", () => {
    it("Checks if the selectOptions State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.selectOptions).toEqual([]);
    });

    it("Checks if the SelectOptions's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setSelectOptions([testSelectOptions]));
      expect(result.current.selectOptions).toEqual([testSelectOptions]);
    });
  });

  describe("Testing ControlComponentState InputOptions State", () => {
    it("Checks if the InputOptions State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.inputOptions).toEqual([]);
    });
  });

  describe("Testing ControlComponentState OutputOptions State", () => {
    it("Checks if the OutputOptions State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.outputOptions).toEqual([]);
    });
    it("Checks if the OutputOptions's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setOutputOptions([testSelectOptions]));
      expect(result.current.outputOptions).toEqual([testSelectOptions]);
    });
  });

  describe("Testing ControlComponentState TextInput State", () => {
    it("Checks if the TextInput State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.textInput).toBe("");
    });
    it("Checks if the TextInput's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      const expectedString = "I got Updated";
      act(() => result.current.setTextInput(expectedString));
      expect(result.current.textInput).toBe(expectedString);
    });
  });

  describe("Testing ControlComponentState NumberInput State", () => {
    it("Checks if the NumberInput State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.numberInput).toBe("0");
    });
    it("Checks if the NumberInput's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      const expectedString = "10";
      act(() => result.current.setNumberInput(expectedString));
      expect(result.current.numberInput).toBe(expectedString);
    });
  });

  describe("Testing ControlComponentState SliderInput State", () => {
    it("Checks if the SliderInput State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.sliderInput).toBe("0");
    });
    it("Checks if the SliderInput's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      const expectedString = "10";
      act(() => result.current.setSliderInput(expectedString));
      expect(result.current.sliderInput).toBe(expectedString);
    });
  });

  describe("Testing ControlComponentState CurrentInputValue State", () => {
    it("Checks if the CurrentInputValue State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.currentInputValue).toBe(0);
    });

    it.each([
      [10, 10],
      ["30", "30"],
    ])(
      "Checks if the CurrentInputValue's State renders/fires with Updated State %p",
      (inputValue, expectedValue) => {
        const { result } = renderHook(() =>
          ControlComponentState(testControlComponentProps)
        );
        act(() => result.current.setCurrentInputValue(inputValue));
        expect(result.current.currentInputValue).toBe(expectedValue);
      }
    );
  });

  describe("Testing ControlComponentState Nd State", () => {
    it("Checks if the Nd State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.nd).toBeNull();
    });
    it("Checks if the Nd's State renders/fires with updated State", () => {
      const testNdState: ResultIO = {
        cmd: "string",
        id: "string",
        result: {
          default_fig: {
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
          data: {
            type: "ordered_pair",
            data: {
              x: [2, 4, 5, 6],
              y: [2, 4, 5, 6],
              z: [2, 4, 5, 6],
            },
          },
        },
      };
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setNd(testNdState));
      expect(result.current.nd).toBe(testNdState);
    });
  });

  describe("Testing ControlComponentState PlotData State", () => {
    it("Checks if the PlotData State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.plotData).toEqual([]);
    });
    it("Checks if the PlotData's State renders/fires with Updated State", () => {
      const updatedTestPlotData: OverridePlotData = [
        {
          x: [5, 3, 2],
          y: [4, 2, 6],
          z: [2, 3, 5],
          type: "scatter",
          mode: "lines",
        },
      ];
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setPlotData(updatedTestPlotData));
      expect(result.current.plotData).toBe(updatedTestPlotData);
    });
  });

  describe("Testing ControlComponentState SelectedOption State", () => {
    it("Checks if the SelectedOption State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.selectedOption).toBe(undefined);
    });
    it("Checks if the SelectedOption's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setSelectedOption(testSelectOptions));
      expect(result.current.selectedOption).toBe(testSelectOptions);
    });
  });

  describe("Testing ControlComponentState SelectedPlotOption State", () => {
    it("Checks if the SelectedPlotOption State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.selectedPlotOption).toBe(undefined);
    });
    it("Checks if the selectedPlotOption's State renders/fires with Updated State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setSelectedPlotOption(testSelectedPlotOption));
      expect(result.current.selectedPlotOption).toBe(testSelectedPlotOption);
    });
  });

  describe("Testing ControlComponentState StyledLayout State", () => {
    it("Checks if the StyledLayout State renders with default State", () => {
      const testStyledLayout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "#2c2e33",
        autosize: true,
        font: { color: "#99f5ff" },
        margin: { t: 40, r: 40, b: 40, l: 40 },
        xaxis: { zeroline: false, type: "linear" },
      };
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.styledLayout).toEqual(testStyledLayout);
    });
  });

  describe("Testing ControlComponentState defaultValue State", () => {
    it("Checks if the defaultValue State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.defaultValue).toBe(0);
    });
  });

  describe("Testing ControlComponentState ParamOptions State", () => {
    it("Checks if the ParamOptions State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.paramOptions).toEqual([]);
    });
  });

  //
  describe("Testing ControlComponentState openFileSelector State", () => {
    it("Checks if the openFileSelector State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      const openFileSelector = jest.fn();

      const testPlainFilesValue = {
        accept: ".txt",
        maxFileSize: 5,
        readFilesContent: false,
        multiple: false,
      };
      openFileSelector.mockReturnValue(testPlainFilesValue);

      expect(result.current.openFileSelector()).toBe(undefined);
      expect(openFileSelector()).toEqual(testPlainFilesValue);
    });
  });
});
