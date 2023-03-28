/* eslint-disable @typescript-eslint/no-var-requires */
const { executeCommand } = require("./pre-job-operations");
const { sendMessageToSocket } = require("./send-msg-to-socket");
const { getAllImages, eraseMemoryData } = require("./write-to-memory");
const statusCodes = require("../src/STATUS_CODES.json");

async function getContainerId(image) {
  try {
    const containerId = await new Promise((resolve, reject) => {
      const cmd = `docker ps -q -f ancestor=${image}`;
      const outputs = [];
      executeCommand(cmd, (data) => {
        if (data === "EXITED_COMMAND") {
          if (outputs.length === 0) {
            reject("EXITED_COMMAND");
          }
        } else {
          outputs.push(data);
          resolve(data.trim());
        }
      });
    });
    return containerId;
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 *
 * stops all the running containers created for nodes
 * erase all the memory data used on creating and building docker containers
 * fires callback with `true` param on success
 *
 * @param {string} jobsetId
 * @param {(param:boolean)=> void} cb
 */
const removeAllContainers = (jobsetId, cb) => {
  const allRunningImages = getAllImages();
  if (allRunningImages.length === 0) {
    return cb(true);
  }
  allRunningImages.forEach(async (image, index) => {
    sendMessageToSocket({
      jobsetId,
      SYSTEM_STATUS: `${statusCodes.RM_DOCKER_CONTAINER}${image}`,
    });
    const containerId = await getContainerId(image);
    const cmd = `docker stop ${containerId}`;
    executeCommand(cmd, (data) => {
      console.log("stopImage:", image, ":: ", data);
      if (data === "EXITED_COMMAND" && index === allRunningImages.length - 1) {
        cb(true);
        eraseMemoryData();
      }
    });
  });
};
module.exports = { removeAllContainers };
