import React from 'react'
module.exports = {
  useSocket: jest.fn(() => ({
    states: {
      socketId: "socket-1234",
      serverStatus: "\ud83d\udd04 connecting to the server...",
      setProgramResults: jest.fn(),
    },
  })),
};
