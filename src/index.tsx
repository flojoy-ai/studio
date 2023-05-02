import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SocketContextProvider } from "./context/socket.context";
// default styling
import "reactflow/dist/style.css";

// or if you just want basic styles
import "reactflow/dist/base.css";

ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
