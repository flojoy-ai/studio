import "@testing-library/jest-dom";
import { expect, jest, it } from "@jest/globals";
import localforage from "localforage";

import  * as CustomModule from "../../utils/CustomError";
import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
} from "../../services/FlowChartServices";

const key: string = "flow-joy";
const rfInstance: any = {
  elements: "fake",
};

const param: any = {
  rfInstance: {
    elements: "test",
  },
  jobsetId: "random",
};

/**
 * Mock function for localforage
 */
jest.mock("localforage", () => ({
  setItem: jest.fn(),
  getItem: (cb: any) => {
    return "data";
  },
}));

/**
 * Mock function for fetch method
 */

global.fetch = jest.fn((url) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
) as any;

describe("FlowChartServices", () => {
  describe("saveFlowChartToLocalStorage", () => {
    it("given a flow chart object, stores it in localstorage", () => {
      // Given
      const setItemSpy = jest.spyOn(localforage, "setItem");

      // When
      saveFlowChartToLocalStorage(rfInstance);

      //Then
      expect(localforage.setItem).toHaveBeenCalledWith(key, rfInstance);
    });

    it.each([[undefined], [null]])(
      "given an %p flow chart object, doesnot store it in localstorage",
      (flowChart: undefined | null) => {
        // Given
        const setItemSpy = jest.spyOn(localforage, "setItem");

        // When
        saveFlowChartToLocalStorage(flowChart as any);

        //Then
        expect(setItemSpy).not.toHaveBeenCalled();
      }
    );
  });

  describe("saveAndRunFlowChartInServer", () => {
    it("given a flow chart and a job id, post the job to /wfc api endpoint", async () => {
      //Given
      const fetchParams: any = {
        body: '{"fc":"{\\"elements\\":\\"test\\"}","cancelExistingJobs":true}',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
      };
      const api_endPoint: string = "/wfc";

      const fetchSpy = jest.spyOn(global, "fetch");

      //When
      await saveAndRunFlowChartInServer(param);
      //Expect
      expect(fetchSpy).toHaveBeenCalledWith(api_endPoint, fetchParams);
    });

    it("given /wfc api returns error, throws custom error", async () => {
      // Given
      const testResponse = { ok: false, status: 404, statusMessage: "Error" };
      jest
        .spyOn(global, "fetch")
        .mockImplementation(() => Promise.resolve(testResponse) as any);
      try {
        //When
        const data = await saveAndRunFlowChartInServer(param);
      } catch (error) {
        //Expect
        expect(error).toBeInstanceOf(CustomModule.CustomError); //https://jestjs.io/docs/tutorial-async#error-handling
      }
    });

    it("given /wfc api return error, throws custom error with proper parameters",()=>{
      //Given
      const expectedParameters = {
        statusMessage:"test",
        statusCode:404
      };
      const constructorSpy = jest.spyOn(CustomModule,'CustomError');

      //When
      new CustomModule.CustomError(expectedParameters);

      //Expect
      expect(constructorSpy).toHaveBeenCalledWith(expectedParameters)
    })

    it.each([
      [{ rfInstance: undefined, jobId: "test" }],
      [{ rfInstance: null, jobId: "test" }],
    ])(
      `given an flow chart object (%p), doesnot call the fetch api`,
      async (flowChart: any) => {
        //Given
        const fetchSpy = jest
          .spyOn(global, "fetch")
          .mockImplementation(() => Promise.resolve({}) as any);
        //Then
        const data = saveFlowChartToLocalStorage(flowChart);
        //Expect
        expect(fetchSpy).not.toHaveBeenCalled();
      }
    );
  });
});