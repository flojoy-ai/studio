/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require("child_process");
const spawn = childProcess.spawn;
const exec = childProcess.exec;

function killProcessMain(pid, callback) {
  if (Number.isNaN(pid)) {
    if (callback) {
      return callback(new Error("pid must be a number"));
    } else {
      throw new Error("pid must be a number");
    }
  }

  let tree = {};
  let pidsToProcess = {};
  tree[pid] = [];
  pidsToProcess[pid] = 1;

  switch (process.platform) {
    case "win32":
      exec("taskkill /pid " + pid + " /T /F", callback);
      break;
    case "darwin":
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn("pgrep", ["-P", parentPid]);
        },
        function () {
          killAll(tree, callback);
        }
      );
      break;

    default: // Linux
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn("ps", [
            "-o",
            "pid",
            "--no-headers",
            "--ppid",
            parentPid,
          ]);
        },
        function () {
          killAll(tree, callback);
        }
      );
      break;
  }
}

function killAll(tree, callback) {
  let killed = {};
  try {
    Object.keys(tree).forEach(function (pid) {
      tree[pid].forEach(function (pidpid) {
        if (!killed[pidpid]) {
          killPid(pid);
          killed[pidpid] = 1;
        }
      });
      if (!killed[pid]) {
        killPid(pid);
        killed[pid] = 1;
      }
    });
  } catch (err) {
    if (callback) {
      return callback(err);
    } else {
      throw err;
    }
  }
  if (callback) {
    return callback();
  }
}

function killPid(pid) {
  try {
    process.kill(parseInt(pid, 10), "SIGINT");
  } catch (err) {
    if (err.code !== "ESRCH") throw err;
  }
}

function buildProcessTree(
  parentPid,
  tree,
  pidsToProcess,
  spawnChildProcessesList,
  cb
) {
  let ps = spawnChildProcessesList(parentPid);
  let allData = "";
  ps.stdout.on("data", function (stdData) {
    let data = stdData.toString("ascii");
    allData += data;
  });

  let onClose = function (code) {
    delete pidsToProcess[parentPid];

    if (code !== 0) {
      // no more parent processes
      if (Object.keys(pidsToProcess).length === 0) {
        cb();
      }
      return;
    }

    allData.match(/\d+/g).forEach(function (pid) {
      pid = parseInt(pid, 10);
      tree[parentPid].push(pid);
      tree[pid] = [];
      pidsToProcess[pid] = 1;
      buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
    });
  };

  ps.on("close", onClose);
}

const killProcess = async (pidNum) => {
  return new Promise((resolve, reject) => {
    killProcessMain(pidNum, (err) => {
      if (err) {
        reject(err);
      }
      resolve("killed");
    });
  });
};

module.exports = { killProcess };
