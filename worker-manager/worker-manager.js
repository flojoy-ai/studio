const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const systemStatus = require("../src/STATUS_CODES.json");
const { createAndRunDockerContainers } = require("./create-docker-containers");

const PORT = process.env.WORKER_MANAGER_PORT || 5000;
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8000;
const BACKEND_API = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const isDocker = process.env.DOCKER || false;
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
 * sends pre-job operation failed status to BACKEND_AP/worker_response
 * which eventually sends that to Frontend
 * @param {string} jobsetId 
 */
const sendErrorResponse = (jobsetId) => {
  fetch(`${BACKEND_API}/worker_response`, {
    method: "POST",
    body: JSON.stringify(JSON.stringify({
      jobsetId,
      SYSTEM_STATUS: systemStatus.PR_JOB_FAILED,
    })),
    headers:{
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => console.log("sendErrorRes: ", data))
    .catch((err) => console.log("sendErrRes err: ", err));
};

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
  if (!isDocker) {
    return runJobs(data);
  }
  const parseFc = JSON.parse(data.fc);
  const nodesRequireCustomDocker = parseFc.nodes.filter(
    (node) => node.data.docker
  );
  if (nodesRequireCustomDocker.length > 0) {
    return createAndRunDockerContainers(nodesRequireCustomDocker, (isCompleted) => {
      if (isCompleted) {
        runJobs(data);
      } else {
        sendErrorResponse(data.jobsetId);
      }
    });
  }
  return runJobs(data.jobsetId)
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
  res.send("Run successfully!");
});
