import '@testing-library/jest-dom'
import {expect, jest, test} from '@jest/globals';
import { saveFlowChartToLocalStorage } from '../../services/FlowChartServices';
import localforage from "localforage";

describe("FlowChartServices",()=>{

    test('render App component', () => {
      const obj:any = {
        "elements":"fake"
      }
      saveFlowChartToLocalStorage(obj)

      expect(localforage.setItem("hello","world")).toEqual("hello");
      expect(localforage.getItem("hello")).toEqual("data")
    });
})