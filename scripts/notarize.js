require("dotenv").config();
const fs = require("fs");
const path = require("path");
process.env.DEBUG = "electron-notarize*";
var electron_notarize = require("@electron/notarize");
/**
 *
 * @param {import('electron-builder').AfterPackContext} params
 * @returns
 */
module.exports = async function (params) {
  if (process.platform !== "darwin") {
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  let appId = "ai.flojoy.studio";

  let appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`,
  );
  if (!fs.existsSync(appPath)) {
    console.log(`skipping notarizing as ${appPath} doens't exist`);
    return;
  }

  console.log(`Notarizing ${appId} found at ${appPath}`);

  return await electron_notarize.notarize({
    tool: "notarytool",
    appBundleId: appId,
    appPath: appPath,
    appleId: process.env.APPLE_ID,
    teamId: process.env.APPLE_TEAM_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
  });
};
