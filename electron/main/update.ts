import { MessageBoxOptions, app, dialog } from "electron";
import { autoUpdater } from "electron-updater";

const CHECK_FOR_UPDATE_INTERVAL = 60000; // 1 mins default
export function update() {
  let updateInterval: NodeJS.Timeout | null = null;
  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = false;

  if (updateInterval) {
    clearInterval(updateInterval);
  }
  const checkInterval = setInterval(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error("Update check error: ", err);
    });
  }, CHECK_FOR_UPDATE_INTERVAL);
  updateInterval = checkInterval;

  // start check
  autoUpdater.on("checking-for-update", function () {
    console.log("checking for update....");
  });

  // update available
  autoUpdater.on("update-available", (arg) => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Found Updates",
        message: "Found updates, do you want update now?",
        detail: `An update of v${
          arg.version
        } is found! Current version is ${app.getVersion()}`,
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
  });

  autoUpdater.on("update-downloaded", () => {
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Install Updates",
      message:
        "A new version has been downloaded. Restart the application to apply the updates.",
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  // if we want to stream the progress info
  autoUpdater.on("download-progress", () => {});
  autoUpdater.on("error", (error) => {
    const response = dialog.showMessageBoxSync({
      title: "Update error!",
      type: "error",
      message: "An error occured while downloading the update.",
      detail: error.message,
      buttons: ["Try Again", "OK"],
    });

    if (response === 1) {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    }
  });
}
