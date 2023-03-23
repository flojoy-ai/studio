const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const os = require("os");

const PORT = process.env.PORT || 5000;
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

const processPreJobOperation = (data) => {
//   console.log(" running os: ", data);
  const nonDockerPlatforms = ["linux", "darwin"];
  if (nonDockerPlatforms.includes(data.running_os)) {
    fetch("http://localhost:8000/run_jobs", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((jsonData) => console.log("return json data; ", jsonData))
      .catch((err) => console.error("error in fetch: ", err));
    return;
  }
  console.log(" running on : ", data.running_os)
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
