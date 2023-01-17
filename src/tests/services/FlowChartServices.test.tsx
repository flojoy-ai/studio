import '@testing-library/jest-dom'
import { expect, jest, test } from '@jest/globals';
import { saveFlowChartToLocalStorage, saveAndRunFlowChartInServer } from '../../services/FlowChartServices';
import localforage from "localforage";

/**
 * Mock function for localforage
 */
jest.mock('localforage', () => ({
  setItem: jest.fn(),
  getItem: (cb: any) => {
    return "data"
  }
}))

/**
 * Mock function for fetch method
 */

global.fetch = jest.fn(url => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({})
})) as any;

describe("FlowChartServices", () => {

  describe("saveFlowChartToLocalStorage",()=>{

    it("checks the set data is equal to test data",()=>{

      const key:string = "flow-joy"

      const value: any = {
        "elements": "fake"
      }

      saveFlowChartToLocalStorage(value)

      expect(localforage.getItem(key)).toEqual("data")

    })

    it('checks the setItem function parameter by setting spy on the localforage', () => {
      const key:string = "flow-joy"

      const value: any = {
        "elements": "fake"
      }

      const setItemSpy = jest.spyOn(localforage, 'setItem');

      saveFlowChartToLocalStorage(value)

      expect(localforage.setItem).toHaveBeenCalledWith(key, value)
    });
  })

  describe("saveAndRunFlowChartInServer", ()=>{

    it("calls /wfc api endpoint using fetch successfully & matches the response with test reponse message",async ()=>{
      const param: any = {
        rfInstance: {
          "elements": "test"
        },
        jobsetId: "random"
      }

      const data = await saveAndRunFlowChartInServer(param)

      expect(data).toEqual({})
    })

    it('checks parameters of the api by setting spy on fetch method', async () => {

      const param: any = {
        rfInstance: {
          "elements": "test"
        },
        jobsetId: "random"
      }
      const fetchParams: any = {
        "body": "{\"fc\":\"{\\\"elements\\\":\\\"test\\\"}\",\"cancelExistingJobs\":true}",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
      }
      const api_endPoint: string = "/wfc"

      const fetchSpy = jest.spyOn(global, "fetch")
      await saveAndRunFlowChartInServer(param)

      expect(fetchSpy).toHaveBeenCalledWith(api_endPoint, fetchParams)
    });

    it("checks the response of unsuccessful api calling using fetch method with test response", async ()=>{

      const param: any = {
        rfInstance: {
          "elements": "fake"
        },
        jobsetId: "random"
      }

      const testResponse = {ok:false,status:404 }

      jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.reject(testResponse) as any)

      await expect(saveAndRunFlowChartInServer(param)).rejects.toEqual(testResponse); //https://jestjs.io/docs/tutorial-async

    })
  })

})