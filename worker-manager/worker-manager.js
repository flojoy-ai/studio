const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const systemStatus = require("../src/STATUS_CODES.json");
const { createAndRunDockerContainers } = require("./create-docker-containers");


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

const sendErrorResponse = (jobsetId) => {
  fetch(`${BACKEND_API}/worker_response`, {
    method: "POST",
    body: JSON.stringify({
      jobsetId,
      SYSTEM_STATUS: systemStatus.PR_JOB_FAILED,
    }),
  });
};

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
    .catch((err) => console.log("Api call to Django backend failed! ", err));
};

const processPreJobOperation = (data) => {
  const isRunningOnDocker = data.is_running_on_docker || false;
  if (!isRunningOnDocker) {
    runJobs(data);
    return;
  }
  const parseFc = JSON.parse(data.fc);
  const nodesRequireCustomDocker = parseFc.nodes.filter(
    (node) => node.data.docker
  );
  if (nodesRequireCustomDocker.length > 0) {
    createAndRunDockerContainers(nodesRequireCustomDocker);
  }
  runJobs(data);
  return;
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
