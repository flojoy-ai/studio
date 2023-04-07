/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("upath");
const os = require("os");
const child_process = require("child_process");
const { writeImageToMemory } = require("./write-to-memory");
const { sendMessageToSocket } = require("./send-msg-to-socket");
const statusCodes = require("./STATUS_CODES.json");

const BUILD_FAILED = "failed to build image!";
const CONTAINER_RUN_FAILED = "failed to run container from image!";

/**
 *
 * Get relative path from home directory of a given path
 *
 * @param {string} pathStr
 * @returns {string}
 */
const getReleativePath = (pathStr) =>
  path.toUnix(path.join(__dirname, pathStr));

/**
 *
 * executes command using `child_process`
 * and calls callback function on `stdout` and `stderr`
 * calls callback function with "EXITED_COMMAND" parameter on exiting
 *
 * @param {string} command
 * @param {(data: string) => void} cb
 */
const executeCommand = (command, cb) => {
  console.info("Running cmd: ", command);
  const script = child_process.exec(command);
  script.stdout.on("data", function (data) {
    if (cb) cb(data);
  });
  script.stderr.on("data", function (data) {
    if (cb) cb(data);
  });
  script.addListener("exit", () => {
    if (cb) cb("EXITED_COMMAND");
  });
};

/**
 *
 * builds docker image from using Dockerfile from given `dockerfilePath` param
 * names to given `imageName` with :latest tag
 *
 * @param {string} dockerFilePath
 * @param {string} imageName
 * @returns
 */
const buildDockerImage = async (dockerFilePath, imageName) => {
  const buildCommand = `docker build -t ${imageName}:latest -f "${dockerFilePath}" "${getReleativePath(
    "../"
  )}"`;

  return new Promise((resolve, reject) => {
    const history = [];
    executeCommand(buildCommand, (data) => {
      console.log(`BUILDING IMAGE:${imageName}:: ${data}`);
      history.push(data);
      if (data === "EXITED_COMMAND") {
        if (history.find((t) => t.includes("naming to"))) {
          resolve("build complete!");
        } else {
          reject(BUILD_FAILED);
        }
      }
    });
  });
};

/**
 *
 * runs docker container from given `imageName`
 * with all `args`
 *
 * @param {string} imageName
 * @param {string[]} args
 * @returns
 */

const runDockerImage = async (imageName, args) => {
  const redisHost = `${path.basename(getReleativePath("../"))}-redis-1`;
  const envs = [
    "-e",
    "BACKEND_HOST=host.docker.internal",
    "-e",
    `REDIS_HOST=${redisHost}`,
  ];
  const runCommand = `docker run ${envs.join(" ")} --network=${path
    .basename(getReleativePath("../"))
    .toLowerCase()}_app_network --rm ${args.join(" ")} -t ${imageName}:latest`;
  return new Promise((resolve, reject) => {
    executeCommand(runCommand, (data) => {
      console.log(`${imageName}:: `, data);
      if (data.includes("Listening on")) {
        writeImageToMemory(`${imageName}:latest`);
        resolve("container is running...");
      }
      if (data.includes("not found") || data === "EXITED_COMMAND") {
        reject(CONTAINER_RUN_FAILED);
      }
    });
  });
};

const buildAndRunContainer = async (
  dockerFilePath,
  imageName,
  args,
  jobsetId,
  cb
) => {
  try {
    await buildDockerImage(dockerFilePath, imageName);
    sendMessageToSocket({
      jobsetId,
      SYSTEM_STATUS: `${statusCodes.IMAGE_BUILD_SUCCESS}${imageName}`,
    });
    sendMessageToSocket({
      jobsetId,
      SYSTEM_STATUS: `${statusCodes.CREATE_DOCKER_CONTAINER}${imageName}`,
    });
    await runDockerImage(imageName, args);
    cb(true);
  } catch (error) {
    sendMessageToSocket({
      jobsetId,
      SYSTEM_STATUS: `${statusCodes.IMAGE_BUILD_FAILED}${imageName}`,
    });
    console.log(
      "error in buildAndRunContainer: ",
      error,
      " msg: ",
      error.message
    );
  }
};

/**
 *
 * Creates, builds and run docker container for given nodes
 * Fires callbackfunction on success and failure.
 *
 * @param {{nodes: any[], jobsetId: string}} param0
 * @param {(param: boolean)=> void} cb
 */
const createAndRunDockerContainers = ({ nodes, jobsetId }, cb) => {
  // build and run container
  nodes.forEach((node, index) => {
    sendMessageToSocket({
      jobsetId,
      SYSTEM_STATUS: `${statusCodes.BUILD_DOCKER_IMAGE}${node.data.func}`,
    });
    const imageName = `flojoy-${node.data.label
      .split(" ")
      .join("-")
      .toLowerCase()}`;
    const args = node.data.docker.arguments[os.platform()] || [];
    const dockerFilePath = getReleativePath(
      `../PYTHON/nodes/custom-docker/${node.data.docker.folder_name}/Dockerfile`
    );
    buildAndRunContainer(
      dockerFilePath,
      imageName,
      args,
      jobsetId,
      (completed) => {
        if (completed && index === nodes.length - 1) {
          cb(true);
        }
      }
    );
  });
};

module.exports = { createAndRunDockerContainers, executeCommand };
