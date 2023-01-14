import '@testing-library/jest-dom'
import {expect, jest, test} from '@jest/globals';
import { saveFlowChartToLocalStorage } from '../../services/FlowChartServices';
import localforage from "localforage";

describe("FlowChartServices",()=>{

    test('getting & setting data from local storage', () => {
      const obj:any = {
        "elements":"fake"
      }
      saveFlowChartToLocalStorage(obj)

      expect(localforage.setItem("hello","world")).toEqual("hello");
      expect(localforage.getItem("hello")).toEqual("data")
    });
})