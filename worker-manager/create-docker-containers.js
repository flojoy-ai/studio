const path = require("upath");
const fs = require("fs");
const yaml = require("js-yaml");

const getReleativePath = (pathStr) => path.join(__dirname, pathStr);

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
    composeFile.services = {
      ...composeFile.services,
      ...serviceObj,
    };
  });

  const dumpYaml = yaml.dump(composeFile, {
    indent: 2,
  });
  fs.writeFileSync(
    `${__dirname}/docker-compose-custom-nodes.yml`,
    dumpYaml,
    "utf-8"
  );
};

const createAndRunDockerContainers = (nodes) => {
  // write compose file
  writeComposeFile(nodes);
  // build and run container
};

module.exports = { createAndRunDockerContainers };
