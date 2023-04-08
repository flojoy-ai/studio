import { IServerStatus } from "@src/context/socket.context";
module.exports = {
  useSocket: jest.fn(() => ({
    states: {
      socketId: "socket-1234",
      serverStatus: IServerStatus.CONNECTING,
      setProgramResults: jest.fn(),
      failureReason: 'test error',
      failedNode: 'node-123'
    },
  })),
};
