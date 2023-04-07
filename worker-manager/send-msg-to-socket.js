/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = require("node-fetch").default;


const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8000;
const BACKEND_API = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
/**
 *
 * sends post request to BACKEND_API/worker_response
 * which eventually sends data to frontend through web socket
 *
 * @param {{jobsetId: string, [key:string]: any}} data
 */
const sendMessageToSocket = (data) => {
  fetch(`${BACKEND_API}/worker_response`, {
    method: "POST",
    body: JSON.stringify(JSON.stringify(data)),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("sendMessageToSocket: ", data))
    .catch((err) => console.log("sendMessageToSocket Error: ", err));
};

module.exports = { sendMessageToSocket };
