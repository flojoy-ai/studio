import "@testing-library/jest-dom";
import { expect, jest, it } from "@jest/globals";
import * as SocketModule from "../../web-socket/socket";

const testParameters = {
    url: "ws://localhost:8080",
    pingResponse: jest.fn(),
    onNodeResultsReceived: {},
    runningNode: jest.fn(),
    failedNode: jest.fn(),
    failureReason: jest.fn(),
    socketId: jest.fn(),
    onClose:jest.fn(),
}

describe("socket",()=>{
    it("given a set of parameters,calls websocket class with proper props",()=>{

        const server = new SocketModule.WebSocketServer(testParameters)

        expect(server).toBeTruthy()
    })

    it("given a set of parameters, calls websocket.init method",()=>{
        const initSpy = jest.spyOn(SocketModule.WebSocketServer.prototype,'init')
        new SocketModule.WebSocketServer(testParameters)
        expect(initSpy).toHaveBeenCalled()
    })
})