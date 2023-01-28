import { expect, jest, it, beforeEach } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { useSocket } from "../../hooks/useSocket";
import * as Context from "../../context/socket.context";
import React from "react";

const wrapper = ({ children }) => (
  <Context.SocketContextProvider>{children}</Context.SocketContextProvider>
);

const { result, rerender } = renderHook(() => useSocket(), { wrapper });

describe("useSocket", () => {
  it("calls useContext hook with Socket Context", () => {
    const spy = jest.spyOn(React, "useContext");
    rerender();
    expect(spy).toHaveBeenCalledWith(Context.SocketContext);
  });
  it("calls SocketContextProvider", () => {
    const spy = jest.spyOn(Context, "SocketContextProvider");
    rerender();
    expect(spy).toHaveBeenCalled();
  });
});
