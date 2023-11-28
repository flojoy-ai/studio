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
    const timeoutSecond = 130000; // 25mins

    test.setTimeout(timeoutSecond);
    const window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    const title = await window.$("title");
    // expect(await title?.innerText()).toContain(productName);
    const welcomeText = `Welcome to Flojoy Studio V${version}`;
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 120000);
    });
    const screenshot = await window.screenshot({ fullPage: true });
    fs.writeFileSync(`test-results/${process.platform}-output.png`, screenshot);
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
      const folderName =
        arch === "arm64" ? `linux-${arch}-unpacked` : "linux-unpacked";
      return join(process.cwd(), `dist/${folderName}/flojoy-studio`);
    }
    default:
      return "";
  }
};
