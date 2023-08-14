import { app } from "electron";
import { join } from "node:path";

module.exports = {
  packagerConfig: {
    icon: join(app.getAppPath(), "/public/appicon.png"),
  },

  // for linux
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: join(app.getAppPath(), "/public/appicon.png"),
        },
      },
    },
  ],
};
