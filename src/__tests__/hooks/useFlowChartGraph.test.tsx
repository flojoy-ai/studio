import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { act, renderHook } from "@testing-library/react";

const { result } = renderHook(() => useFlowChartGraph());
const hookResult = result.current;

jest.mock("@src/utils/ManifestLoader");

describe("useFlowChartGraph", () => {
  describe("loadFlowExportObject", () => {
    it.each([
      ["undefined", undefined, false],
      [
        "not undefined",
        {
          elements: "test",
          position: [0, 0],
          zoom: 1,
        },
        false,
      ],
    ])(
      "given a/an %p flow object, returns from the function",
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
});
