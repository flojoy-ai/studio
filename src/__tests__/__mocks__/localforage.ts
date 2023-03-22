import { jest } from "@jest/globals";

const mock = {
  config: jest.fn(),
  setItem: jest.fn(),
  getItem: jest.fn().mockImplementation(() => Promise.resolve()),
};

export default mock;

export default mock;