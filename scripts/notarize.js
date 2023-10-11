require("dotenv").config();
const fs = require("fs");
const path = require("path");
process.env.DEBUG = "electron-notarize*";
var electron_notarize = require("@electron/notarize");

module.exports = async function (params) {
  if (process.platform !== "darwin") {
    return;
  }

  console.log("afterSign hook triggered", params);

  let appId = "ai.flojoy.studio";

  let appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`,
  );
  if (!fs.existsSync(appPath)) {
    console.log("skip");
    return;
  }

  console.log(`Notarizing ${appId} found at ${appPath} app id is ${process.env.APPLE_ID}`);

  return await electron_notarize.notarize({
    tool: "notarytool",
    appBundleId: appId,
    appPath: appPath,
    appleId: process.env.APPLE_ID,
    // appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
  });
};
