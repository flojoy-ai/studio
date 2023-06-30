import { renderHook } from "@testing-library/react";
import { useSocket } from "../../hooks/useSocket";
import * as Context from "../../context/socket.context";
import * as React from "react";

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
});
