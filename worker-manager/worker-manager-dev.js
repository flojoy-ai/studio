/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { sendMessageToSocket } = require("./send-msg-to-socket");
const statusCodes = require("../src/STATUS_CODES.json")

const PORT = process.env.WORKER_MANAGER_PORT || 5000;
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8000;
const BACKEND_API = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const app = express();

app.use(cors());
app.listen(PORT, () => console.log(`Running worker-manager on port: ${PORT}`));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Worker-manager is up and running...");
});


/**
 *
 * sends post request to BACKEND_API to run jobs
 *
 * @param {{fc: {nodes:Node[], edges: Edge[]}, jobsetId:string}} data
 */
const runJobs = (data) => {
  fetch(`${BACKEND_API}/run_jobs`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((jsonData) => console.log("return json data; ", jsonData))
    .catch((err) => console.log("Api call to backend failed! ", err));
};

/**
 *
 * Handles logic for custom docker support if required by nodes
 *
 * @param {{fc: {nodes:Node[], edges: Edge[]}, jobsetId:string}} data
 * @returns
 */
const processPreJobOperation = (data) => {
  return runJobs(data);
};

app.post("/prepare-jobs", (req, res) => {
  processPreJobOperation(req.body);
  res
    .status(400)
    .json({
      success: true,
    })
    .end();
});
app.post("/post-job-run", (req, res) => {
  
  sendMessageToSocket({
    jobsetId: req.body.jobsetId,
    SYSTEM_STATUS: statusCodes.STANDBY
  })
  res.send("Run successfully!");
  res.end()
});
