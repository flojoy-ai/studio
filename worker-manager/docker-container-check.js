const child_process =require("child_process");

const checkIfContainersRunning = (composeFile, cb) => {
  const composePs = child_process.spawn("docker-compose", ["-f", composeFile, "ps", "-q"]);
  composePs.stdout.on("data", (data) => {
    const containerIds = data.toString().trim().split("\n");
    const promises = containerIds.map((id) => {
      return new Promise((resolve, reject) => {
        const containerStatus = child_process.spawn("docker", [
          "inspect",
          "-f",
          "{{.State.Status}}",
          id,
        ]);
        containerStatus.stdout.on("data", (data) => {
          const status = data.toString().trim();
          if (status === "running") {
            resolve(true);
          } else {
            resolve(false);
          }
        });
        containerStatus.stderr.on("data", (data) => {
          console.error(data.toString());
          reject();
        });
        containerStatus.on("close", (code) => {
          if (code !== 0) {
            reject();
          }
        });
      });
    });
    Promise.all(promises).then((results) => {
      if (results.every((result) => result)) {
        console.log("All containers are running!");
        cb(true)
      } else {
        cb(false)
      }
    });
  });

  composePs.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  composePs.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

module.exports = {checkIfContainersRunning}