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
  onClose: jest.fn(),
};
let socketMock:any;

global.WebSocket = jest.fn().mockImplementation(function (url) {
    socketMock = {
        url: url,
        readyState: 0,
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3,
        send: jest.fn().mockImplementation(function(data){}),
        close: jest.fn().mockImplementation(function () {
            socketMock.readyState = 2;
        }),
        // methods to mock the internal behaviour of the real WebSocket
        _open: function () {
            socketMock.readyState = 1;
            socketMock.onopen && socketMock.onopen();
        },
        _message: function (msg) {
            socketMock.onmessage && socketMock.onmessage({ data: msg });
        },
        _error: function () {
            socketMock.readyState = 3;
            socketMock.onerror && socketMock.onerror();
        },
        _close: function () {
            socketMock.readyState = 3;
            socketMock.onclose && socketMock.onclose();
        },
    };
    return socketMock
}) as any;

describe("WebSocketServer", () => {
    describe("constructor",()=>{
        it("given a set of parameters,calls websocket class with proper props", () => {
          const server = new SocketModule.WebSocketServer(testParameters);

          expect(server).toBeTruthy();
        });

        it("given a set of parameters,creates a websocket server",()=>{
            const webserverSpy = jest.spyOn(global,'WebSocket')
            new SocketModule.WebSocketServer(testParameters);

            expect(webserverSpy).toHaveBeenCalledWith(testParameters.url)
        })
    })

    describe("init method",()=>{

        it("given a set of parameters, calls websocket.init method", () => {
          const initSpy = jest.spyOn(SocketModule.WebSocketServer.prototype, "init");
          new SocketModule.WebSocketServer(testParameters);
          expect(initSpy).toHaveBeenCalled();
        });

        describe("websocket.onmessage",()=>{

            it("sets websocket's onmessage callback", () => {

              new SocketModule.WebSocketServer(testParameters);

              expect(socketMock.onmessage).not.toBeUndefined()

            });
            describe("'worker_response' data type",()=>{
                it.each([
                    [
                        {
                            data:JSON.stringify({
                                type:"worker_response",
                                SYSTEM_STATUS:"OK"
                            })
                        },
                        "OK"
                    ],
                    [
                        {
                            data:JSON.stringify({
                                type:"worker_response",
                                SYSTEM_STATUS:"🤙 python script run successful"
                            })
                        },
                        "🐢 awaiting a new job"
                    ]
                ])("given an event message (%p), sets pingresponse with proper status message (%p)",(testValue,expectedMessage)=>{
                    new SocketModule.WebSocketServer(testParameters);
                    socketMock.onmessage(testValue)

                    expect(testParameters.pingResponse).toBeCalledWith(expectedMessage)
                })

                it.each([
                    [
                        {
                            data:JSON.stringify({
                                SYSTEM_STATUS:"OK",
                                type:'worker_response'
                            })
                        },
                        testParameters.pingResponse
                    ],
                    [
                        {
                            data:JSON.stringify({
                                RUNNING_NODE:"OK",
                                type:'worker_response'
                            })
                        },
                        testParameters.runningNode
                    ],
                    [
                        {
                            data:JSON.stringify({
                                FAILED_NODES:"OK",
                                type:'worker_response'
                            })
                        },
                        testParameters.failedNode
                    ]
                ])("given a event data (%p), calls the proper method (%p)",(data,expectedMethodCall)=>{
                    new SocketModule.WebSocketServer(testParameters);
                    socketMock.onmessage(data)
                    expect(expectedMethodCall).toHaveBeenCalled()
                })
            })
            describe("'connection_established' data type",()=>{
                it("given a socketId,calls setsocketid method",()=>{
                    const ev = {
                        data:JSON.stringify({
                            type:"connection_established",
                            SYSTEM_STATUS:"OK"
                        })
                    }

                    new SocketModule.WebSocketServer(testParameters);
                    socketMock.onmessage(ev)
                    expect(testParameters.socketId).toHaveBeenCalled()
                })
            })

            describe("default data type",()=>{
                it("checking if the response doesnot exist in data",()=>{
                    const ev = {
                        data:JSON.stringify({
                            type:"test",
                            SYSTEM_STATUS:"OK"
                        })
                    }

                    new SocketModule.WebSocketServer(testParameters);
                    socketMock.onmessage(ev)

                    expect(testParameters.pingResponse).not.toBeCalled()
                })
            })
        })

    })

    describe("disconnect method",()=>{
        it("given a set of parameters, calls disconnect method",()=>{
            new SocketModule.WebSocketServer(testParameters).disconnect();
            expect(socketMock.close).toHaveBeenCalled()

        })
    })

    describe("emit method",()=>{
        it("given a set of parameters, calls emit method",()=>{
            const testMsg = "test"
            new SocketModule.WebSocketServer(testParameters).emit(testMsg);
            expect(socketMock.send).toHaveBeenCalled()
        })
    })

    describe("isConnected",()=>{
        it("given a set of parameters, calls isConnected method",()=>{
            const response = new SocketModule.WebSocketServer(testParameters).isConnected()
            expect(response).toEqual(socketMock.readyState)
        })
    })

});
