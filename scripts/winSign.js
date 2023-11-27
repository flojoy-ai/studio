require("dotenv").config();
const exec = require("child_process").exec;

/**
 *
 * @param {import('electron-builder').CustomWindowsSignTaskConfiguration} params
 * @returns
 */
module.exports = async function (params) {
  if (process.platform !== "win32") {
    return;
  }
  if (process.env.NODE_ENV === "dev") {
    return;
  }

  const signCmd = `AzureSignTool sign -kvu "${process.env.AZURE_KEY_VAULT_URI}" -kvi "${process.env.AZURE_CLIENT_ID}" -kvt "${process.env.AZURE_TENANT_ID}" -kvs "${process.env.AZURE_CLIENT_SECRET}" -kvc ${process.env.AZURE_CERT_NAME} -tr http://timestamp.digicert.com -v "${params.path}"`;
  const signTask = new Promise((resolve, reject) => {
    exec(signCmd, (error, stdout, sdterr) => {
      console.log(stdout);
      console.log(sdterr);

      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
  return await signTask;
};
