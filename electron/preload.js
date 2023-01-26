/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", (_) => {
  const outputList = document.getElementById("log-message");
  const appStatusElem = document.getElementById("app-status");
  ipcRenderer.send("ping");
  ipcRenderer.on("msg", (_, arg) => {
    const output = document.createElement("li");
    output.innerText = arg;
    outputList.appendChild(output);
    output.children
      .item(output.children.length - 1)
      .scrollIntoView({ behavior: "smooth" });
  });

  ipcRenderer.on("err", (_, arg) => {
    const output = document.createElement("li");
    output.innerText = arg;
    outputList.appendChild(output);
    output.children
      .item(output.children.length - 1)
      .scrollIntoView({ behavior: "smooth" });
  });
  ipcRenderer.on("app_status", (_, arg) => {
    appStatusElem.innerHTML = arg.toString();
  });
});
