import { act, renderHook } from "@testing-library/react-hooks";
import ControlComponentState, {
  ControlComponentStateProps,
} from "@src/feature/controls_panel/views/control-component/ControlComponentState";
import { ControlOptions, NodeInputOptions } from "@src/feature/controls_panel/types/ControlOptions";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";

const testControlComponentProps: ControlComponentStateProps = {
  updateCtrlValue: "myUpdatedValue",
  theme: "dark",
  ctrlObj: {
    id: "plot-control",
    name: "Plot Control",
    type: "plot",
    minHeight: 10,
    minWidth: 10,
    layout: { i: "asd", x: 34, y: 34, w: 23, h: 3 },
  },
};

const testSelectOptions: ControlOptions[] = [
  {
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
  },
];

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
      act(() => result.current.setSelectOptions(testSelectOptions));
      expect(result.current.selectOptions).toBe(testSelectOptions);
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

  // 
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
      act(() => result.current.setOutputOptions(testSelectOptions));
      expect(result.current.outputOptions).toBe(testSelectOptions);
    });
  });


  // 
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
      const expectedString = "I got Updated"
      act(() => result.current.setTextInput(expectedString));
      expect(result.current.textInput).toBe(expectedString);
    });
  });


  // 
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
      const expectedString = "10"
      act(() => result.current.setNumberInput(expectedString));
      expect(result.current.numberInput).toBe(expectedString);
    });
  });

   // 
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
      const expectedString = "10"
      act(() => result.current.setSliderInput(expectedString));
      expect(result.current.sliderInput).toBe(expectedString);
    });
  });

  // 
  describe("Testing ControlComponentState CurrentInputValue State", () => {
    it("Checks if the CurrentInputValue State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.currentInputValue).toBe(0);
    });
   
    it.each([
      [10, 10], ["30", "30"]
    ]) ("Checks if the CurrentInputValue's State renders/fires with Updated State %p",(inputValue, expectedValue) => {
      const { result } = renderHook(() =>
      ControlComponentState(testControlComponentProps)
    );
      act(() => result.current.setCurrentInputValue(inputValue));
      expect(result.current.currentInputValue).toBe(expectedValue);
    })
  });


  // 
  describe("Testing ControlComponentState Nd State", () => {
    it("Checks if the Nd State renders with default State", () => {
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.nd).toBeNull();
    });
    it("Checks if the Nd's State renders/fires with Updated State", () => {
      const testNdState: ResultIO = {
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
      }
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setNd(testNdState));
      expect(result.current.nd).toBe(testNdState);
    });
  });


  // 
  describe("Testing ControlComponentState PlotData State", () => {
    it("Checks if the PlotData State renders with default State", () => {
      const testPlotData = [
        {
          x: [1, 2, 3],
          y: [1, 2, 3],
          z: [1, 2, 3],
          source: "",
          type: "scatter",
          mode: "lines",
        },
      ]
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      expect(result.current.plotData).toEqual(testPlotData);
    });
    it("Checks if the PlotData's State renders/fires with Updated State", () => {
      const updatedTestPlotData = [
        {
          x: [5, 3, 2],
          y: [4,2, 6],
          z: [2, 3, 5],
          source: "",
          type: "scatter",
          mode: "bar",
        },
      ]
      const { result } = renderHook(() =>
        ControlComponentState(testControlComponentProps)
      );
      act(() => result.current.setPlotData(updatedTestPlotData));
      expect(result.current.plotData).toBe(updatedTestPlotData);
    });
  });

});
