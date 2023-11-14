import { MessageBoxOptions, app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log/main";

const CHECK_FOR_UPDATE_INTERVAL = 600000; // 10 mins default
export function update(cleanupFunc: () => Promise<void>) {
  global.updateInterval = null;
  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.logger = {
    error: (msg) => log.error(msg),
    info: (msg) => log.info(msg),
    warn: (msg) => log.warn(msg),
    debug: (msg) => log.debug(msg),
  };
  if (global.updateInterval) {
    clearInterval(global.updateInterval);
  }

  const checkInterval = setInterval(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      log.error("Update check error: ", err);
    });
  }, CHECK_FOR_UPDATE_INTERVAL);

  global.updateInterval = checkInterval;

  // start check
  autoUpdater.on("checking-for-update", () =>
    log.info("checking for update...."),
  );

  // update available
  autoUpdater.on("update-available", (arg) => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Found Updates",
        message: "Found updates, do you want update now?",
        detail: `An update to v${
          arg.version
        } is available! Current version is ${app.getVersion()}`,
        buttons: ["Sure", "No"],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response === 0) {
          autoUpdater.downloadUpdate();
          dialog.showMessageBox({
            type: "info",
            title: "Downloading update!",
            message:
              "Downloading the update.. you'll be notified once update is ready to install..",
          });
        }
      });
    if (global.updateInterval) {
      clearInterval(global.updateInterval);
    }
  });

  autoUpdater.on("update-downloaded", () => {
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Install Updates",
      message:
        "A new version has been downloaded. Restart the application to apply the updates.",
    };

    dialog.showMessageBox(dialogOpts).then(async (returnValue) => {
      if (returnValue.response === 0) {
        await cleanupFunc();
        autoUpdater.quitAndInstall();
      }
    });
    if (global.updateInterval) {
      clearInterval(global.updateInterval);
    }
  });

  // if we want to stream the progress info
  autoUpdater.on("download-progress", () => {});
  autoUpdater.on("error", (error) => {
    log.error("Update error: ", error.stack?.toString() ?? "");
    const response = dialog.showMessageBoxSync({
      title: "Update error!",
      type: "error",
      message: "An error occured while downloading the update.",
      buttons: ["Try Again", "OK"],
    });

    if (response === 1) {
      if (global.updateInterval) {
        clearInterval(global.updateInterval);
      }
    }
  });
}
