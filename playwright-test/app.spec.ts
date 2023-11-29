import { ElectronApplication, _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
import fs from "fs";
import { join } from "path";
const { productName, version } = JSON.parse(
  fs.readFileSync(join(process.cwd(), "package.json"), { encoding: "utf-8" }),
);

test.describe(`${productName} test`, () => {
  let app: ElectronApplication;
  test.beforeAll(async () => {
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
  });

  test.afterAll(async () => {
    const logPath = await app.evaluate(async ({ app: _app }) => {
      return _app.getPath("logs");
    });
    const logFile = join(logPath, "main.log");
    const logs = fs.readFileSync(logFile);
    fs.writeFileSync(`test-results/${process.platform}-logs.txt`, logs);
    await app.close();
  });

  test("Check if app is packaged", async () => {
    const isPackaged = await app.evaluate(async ({ app: _app }) => {
      return _app.isPackaged;
    });
    expect(isPackaged).toBe(true);
  });

  test(`Check if title matches product name: ${productName}`, async () => {
    const appName = await app.evaluate(async ({ app: _app }) => {
      return _app.getName();
    });
    expect(appName).toBe(productName);
  });

  test(`Check if version matches package.json version: ${version}`, async () => {
    const appVersion = await app.evaluate(async ({ app: _app }) => {
      return _app.getVersion();
    });
    expect(appVersion).toEqual(version);
  });

  test("App should be loaded correctly.", async () => {
    const timeoutSecond = 900000; // 15mins
    test.setTimeout(timeoutSecond);
    const window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    const title = await window.$("title");
    expect(await title?.innerText()).toContain(productName);
    const welcomeText = `Welcome to Flojoy Studio V${version}`;
    await window.getByText(welcomeText).innerText({ timeout: timeoutSecond });
  });
});

const getExecutablePath = () => {
  switch (process.platform) {
    case "darwin":
      return join(
        process.cwd(),
        "dist/mac-universal/Flojoy Studio.app/Contents/MacOS/Flojoy Studio",
      );
    case "win32": {
      const arch = process.arch;
      const folderName =
        arch === "arm64" ? `win-${arch}-unpacked` : "win-unpacked";
      return join(process.cwd(), `dist/${folderName}/Flojoy Studio.exe`);
    }
    case "linux": {
      const arch = process.arch;
      const fileName = `${productName}-${version}${
        arch === "arm64" ? `-${arch}` : ""
      }.appImage`;
      console.log("filename: ", fileName);
      return join(process.cwd(), `dist/${fileName}`);
    }
    default:
      return "";
  }
};
