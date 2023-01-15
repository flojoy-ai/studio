import '@testing-library/jest-dom'
import { expect, jest, test } from '@jest/globals';
import { saveFlowChartToLocalStorage } from '../../services/FlowChartServices';
import localforage from "localforage";

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
})