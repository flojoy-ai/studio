const path = require("upath");
const fs = require("fs");
const yaml = require("js-yaml");
const child_process = require("child_process");
const {checkIfContainersRunning} = require("./docker-container-check")

const getReleativePath = (pathStr) => path.join(__dirname, pathStr);
const COMPOSE_FILE_NAME = "docker-compose-custom-nodes.yml";
const COMPOSE_FILE_PATH = getReleativePath(`./${COMPOSE_FILE_NAME}`);
const servicesOnComposeFile = [];

const executeCommand = (command, cb) => {
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
const buildDockerImage = (composeFilePath, cb) => {
  executeCommand(`docker-compose -f ${composeFilePath} up`, (data)=>{
    console.log("buildDocker: ", data)
    if(data === "EXITED_COMMAND" || data.includes("not found")){
      cb(false)
      return;
    }
   checkIfContainersRunning(COMPOSE_FILE_NAME, (isRunningAll)=>{
    if(isRunningAll){
      cb(true)
    } else {
      cb(false)
    }
   }) 
  })
}

const createDockerCompose = (node) => {
  const dockerInfo = node.data.docker;
  const dockerFilePath = getReleativePath(
    `../PYTHON/nodes/custom-docker/${dockerInfo.folder_name}/Dockerfile`
  );
  return {
    [`flojoy_${dockerInfo.folder_name}`]: {
      image: "onscene/flojoy-rq-worker:${RQ_WORKER_IMAGE_TAG:-latest}",
      build: {
        context: ".",
        dockerfile: dockerFilePath,
      },
      networks: ["app_network"],
    },
  };

  //   console.log("dockerFilePath: ", dockerFilePath);
};

const writeComposeFile = (nodes) => {
  const composeFile = {
    version: "3",
    services: {},
  };
  nodes.forEach((node) => {
    const serviceObj = createDockerCompose(node);
    servicesOnComposeFile.push(Object.keys(serviceObj).join(""));
    composeFile.services = {
      ...composeFile.services,
      ...serviceObj,
    };
  });

  const dumpYaml = yaml.dump(composeFile, {
    indent: 2,
  });
  fs.writeFileSync(`${__dirname}/${COMPOSE_FILE_NAME}`, dumpYaml, "utf-8");
};

const createAndRunDockerContainers = (nodes, cb) => {
  // write compose file
  writeComposeFile(nodes);
  // build and run container
  buildDockerImage(COMPOSE_FILE_PATH, (completed)=>{
    if(completed){
      cb(true)
    } else {
      cb(false)
    }
  });
};

module.exports = { createAndRunDockerContainers };
