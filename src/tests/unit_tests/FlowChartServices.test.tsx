import React from "react"
import '@testing-library/jest-dom'
import {expect, jest, test} from '@jest/globals';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer'

import { saveFlowChartToLocalStorage } from '../../services/FlowChartServices';
import localforage from "localforage";
import { FlowExportObject } from "react-flow-renderer";
import { any } from "cypress/types/bluebird";

// import * as Localforage from "localforage"

const mockSetItem = jest.fn()

// jest.mock("localforage", () => {
//   const originalModule : any = jest.requireActual("localforage");

//   //Mock the default export and named export 'foo'
//   return {
//     __esModule: true,
//     ...originalModule,
//     default:{setItem: mockSetItem},
//   };
// })



describe("FlowChartServices",()=>{
    // describe("saveFlowChartToLocalStorage",()=>{

    // })
    // test("Save the rfInstance to local storage",()=>{

    //   const spyLocalForage = jest.spyOn(Localforage,"setItem").mockResolvedValue(()=>jest.fn())

    //   const obj:any = {
    //     "elements":"fake"
    //   }
    //   saveFlowChartToLocalStorage(obj)

    //   expect(spyLocalForage).toHaveBeenCalled();
    //   // expect(defaultExportResult).toBe('mocked baz');
    // })
    test('render App component', () => {
      // jest.mock('localforage', () => ({
      //   setItem: (item: string,value:any) => jest.fn()
      // }));

      // jest.spyOn(Storage.prototype, 'setItem');
      // Storage.prototype.setItem = jest.fn();

      const obj:any = {
        "elements":"fake"
      }
      saveFlowChartToLocalStorage(obj)

      expect(localforage.setItem("hello","world")).toEqual("hello");
      expect(localforage.getItem("hello")).toEqual("data")
    });
})