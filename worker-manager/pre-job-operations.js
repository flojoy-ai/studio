/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("upath");
const os = require("os");
const child_process = require("child_process");
const { writeImageToMemory } = require("./write-to-memory");
const { sendMessageToSocket } = require("./send-msg-to-socket");
const statusCodes = require("../src/STATUS_CODES.json")

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
 * builds and run docker image from given `Dockerfile` path
 * and image name.
 * fires callback function on successfully running container with `true`
 * fires callback function on code exit with `false`
 * 
 * @param {string} dockerFilePath 
 * @param {string} imageName 
 * @param {string[]} args 
 * @param {(isComplete: boolean)=> void} cb 
 */

const buildDockerImage = (dockerFilePath, imageName, args, cb) => {
  const buildCommand = `docker build -t ${imageName}:latest -f "${dockerFilePath}" "${getReleativePath("../")}"`;
  const redisHost = `${path.basename(getReleativePath('../'))}-redis-1`
  const envs = ['-e', 'BACKEND_HOST=host.docker.internal', '-e', `REDIS_HOST=${redisHost}`, ]
  const runCommand = `docker run ${envs.join(' ')} --network=${path.basename(getReleativePath("../")).toLowerCase()}_app_network --rm ${args.join(' ')} -t ${imageName}:latest`
  const cmd = `${buildCommand} && ${runCommand}`;
  let isRunning = false;
  executeCommand(cmd, (data) => {
    console.log(`${imageName} :: `, data);
    if (data.includes("Listening on")) {
      writeImageToMemory(`${imageName}:latest`)
      isRunning = true
      cb(true);
      return;
    }
    if ((data.includes("not found") || data === 'EXITED_COMMAND') && !isRunning) {
      cb(false);
      return;
    }
  });
};

/**
 * 
 * Creates, builds and run docker container for given nodes
 * Fires callbackfunction on success and failure.
 * 
 * @param {{nodes: any[], jobsetId: string}} param0 
 * @param {(param: boolean)=> void} cb 
 */
const createAndRunDockerContainers = ({nodes, jobsetId}, cb) => {
  // build and run container
  nodes.forEach((node, index)=> {
    sendMessageToSocket({
      jobsetId,
      'SYSTEM_STATUS': `${statusCodes.BUILD_DOCKER_CONTAINER}${node.data.func}`
    })
    const imageName = `flojoy-${node.data.label.split(' ').join("-").toLowerCase()}`
    const args = node.data.docker.arguments[os.platform()] || [];
    const dockerFilePath = getReleativePath(
      `../PYTHON/nodes/custom-docker/${node.data.docker.folder_name}/Dockerfile`
    );
    buildDockerImage(dockerFilePath, imageName, args, (completed) => {
      if (completed && index === nodes.length - 1) {
        cb(true)
      } else {
        cb(false);
      }
    });

  })
};

module.exports = { createAndRunDockerContainers, executeCommand };
