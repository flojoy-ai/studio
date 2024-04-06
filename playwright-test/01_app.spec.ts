import { ElectronApplication, _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
import fs from "fs";
import { join } from "path";
import { getExecutablePath, mockDialogMessage, writeLogFile } from "./utils";
const { productName, version } = JSON.parse(
  fs.readFileSync(join(process.cwd(), "package.json"), { encoding: "utf-8" }),
);

test.describe(`${productName} startup test`, () => {
  let app: ElectronApplication;
  test.beforeAll(async () => {
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
    await mockDialogMessage(app);
  });

  test.afterAll(async () => {
    await writeLogFile(app, `flojoy-startup-test`);
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
    const timeoutSecond = 300000; // 5mins
    test.setTimeout(timeoutSecond);
    const window = await app.firstWindow({ timeout: timeoutSecond / 2 });
    await window.waitForLoadState("domcontentloaded");
    const title = await window.$("title");
    expect(await title?.innerText()).toContain(productName);
    const welcomeText = `Welcome to Flojoy Studio V${version}`;
    await window.getByText(welcomeText).innerText({ timeout: timeoutSecond });
  });
});
