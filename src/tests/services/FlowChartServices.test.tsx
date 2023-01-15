import '@testing-library/jest-dom'
import { expect, jest, test } from '@jest/globals';
import { saveFlowChartToLocalStorage, saveAndRunFlowChartInServer } from '../../services/FlowChartServices';
import localforage, { iterate } from "localforage";

jest.mock('localforage', () => ({
  setItem: jest.fn(),
  getItem: (cb: any) => {
    return "data"
  }
}))

describe("FlowChartServices", () => {

  it('getting & setting data from local storage', () => {

    const key = "flow-joy"

    const obj: any = {
      "elements": "fake"
    }

    Storage.prototype.setItem = localforage.setItem

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    saveFlowChartToLocalStorage(obj)

    expect(setItemSpy).toBeCalled();
    expect(localforage.setItem).toHaveBeenCalledWith(key, obj)
    expect(localforage.getItem(key)).toEqual("data")
  });

  it('calling fetch api with success', async () => {

    global.fetch = jest.fn(url => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    })) as any;

    const obj: any = {
      "elements": "fake"
    }

    const jobsetId: string = "random"

    const param: any = {
      rfInstance: obj,
      jobsetId: jobsetId
    }

    const fetchParams = {
      "body": "{\"fc\":\"{\\\"elements\\\":\\\"fake\\\"}\",\"cancelExistingJobs\":true}",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      method: "POST",
    }

    const data = await saveAndRunFlowChartInServer(param)

    const fetchSpy = jest.spyOn(global, "fetch")

    expect(data).toEqual({})
    expect(fetchSpy).toHaveBeenCalled()
    expect(fetchSpy).toHaveBeenCalledWith("/wfc", fetchParams)
  });

  it("calling fetch api with error message", async ()=>{

    const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockImplementation(() => Promise.reject({status:false }) as any)

    const obj: any = {
      "elements": "fake"
    }

    const jobsetId: string = "random"

    const param: any = {
      rfInstance: obj,
      jobsetId: jobsetId
    }

    expect(fetchMock).toBeCalled()
    await expect(saveAndRunFlowChartInServer(param)).rejects.toEqual({status:false});

  })
})