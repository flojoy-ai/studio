import {expect, jest, test} from '@jest/globals';

const mock = {
    setItem: ()=> "hello",
    getItem: () => "data",
    removeItem: () => jest.fn(),
};

export default mock;