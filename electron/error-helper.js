exports.getErrorDetail = (msg) => {
  const errTextsObject = {
    "errorduringconnect:thiserrormayindicatethatthedockerdaemonisnotrunning": {
      message: "Docker Not Running!",
      detail:
        "It seems like your docker is not running. Please start docker service and restart this app.",
    },
    isnotrecognizedasaninternalorexternalcommand: {
      message: "Docker Not Found!",
      detail:
        "It seems like docker is not installed on your machine or docker path is missing in PATH environment.",
    },
    "docker-compose:commandnotfound": {
      message: "Docker-compose Not Found!",
      detail:
        "It looks like docker-compose is not installed on your machine. Please install docker-compose and restart the app.",
    },
    "docker:commandnotfound": {
      message: "Docker Not Found!",
      detail:
        "It seems like docker is not installed on your machine or docker path is missing in PATH environment.",
    },
    isnotrecognizedasanameofacmdlet: {
      message: "Docker Not Found!",
      detail:
        "It seems like docker is not installed on your machine or docker path is missing in PATH environment.",
    },
    unknownshorthandflag: {
      message: "Docker Compose is not installed!",
      detail:
        "Docker Compose is not found on your machine. Installing Docker-desktop or docker-compose may solve this problem.",
    },
    permissiondeniedwhiletryingtoconnectto: {
      message: "Permission denied!",
      detail:
        "Permission denied while trying to connect to Docker. Give docker permission to current user may solve this issue.",
    },
    "docker-credential-desktopresolvestoexecutableincurrentdirectory": {
      message: "Error getting credentials",
      detail:
        "This is because a wrong entry in ~/.docker/config.json was created. Namely credsStore instead of credStore. Changing the entry in ~/.docker/config.json may solve the problem.",
    },
    "/bin/sh:1:docker-compose:notfound":{
      message: "Docker Compose not found!",
      detail: "Docker compose was not found in your machine. You can install it from https://docs.docker.com/engine/install "
    }
  };
  const errTextObjKeys = Object.keys(errTextsObject);
  const errorIndex = errTextObjKeys.findIndex((key) =>
    msg.split(" ").join("").includes(key)
  );
  if (errorIndex === -1) {
    return {
      message: "Docker compose error!",
      detail: msg,
    };
  }
  return errTextsObject[errTextObjKeys[errorIndex]];
};
