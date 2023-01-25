import { jest } from "@jest/globals";

const mock = {
  setItem: jest.fn(),
  getItem: (cb: any) => {
    return "data";
  },
};

export default mock;
