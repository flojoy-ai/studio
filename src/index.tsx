import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SocketContextProvider } from "./context/socket.context";
// default styling
import "reactflow/dist/style.css";
import { createRoot } from "react-dom/client";

// or if you just want basic styles
import "reactflow/dist/base.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>
);
