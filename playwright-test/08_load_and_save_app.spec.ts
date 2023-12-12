import { test, expect, Page, ElectronApplication } from "@playwright/test";
import { _electron as electron } from "playwright";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  mockDialogMessage,
  standbyStatus,
  writeLogFile,
} from "./utils";
import { Selectors } from "./selectors";
import { join } from "path";
import blockApp from "./fixtures/app.json";
import { existsSync } from "fs";
import os from "os";

test.describe("Load and save app", () => {
  let window: Page;
  let app: ElectronApplication;
  test.beforeAll(async () => {
    test.setTimeout(STARTUP_TIMEOUT);
    const executablePath = getExecutablePath();
    app = await electron.launch({ executablePath });
    await mockDialogMessage(app);
    window = await app.firstWindow();
    await expect(
      window.locator("code", { hasText: standbyStatus }),
    ).toBeVisible({ timeout: STARTUP_TIMEOUT });
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();
  });

  test.afterAll(async () => {
    await writeLogFile(app, "load-save-app");
    await app.close();
  });

  test("Should save an app to local file system", async () => {
    // Click on file button from right top nav bar
    await window.getByTestId(Selectors.fileBtn).click();

    // Define a path where app should be saved to
    const savePath = join(os.homedir(), "app.json");

    // Mock saveAs dialog and return the save path
    await app.evaluate(async ({ dialog }, savePath) => {
      dialog.showSaveDialog = () =>
        Promise.resolve({ filePath: savePath, canceled: false });
    }, savePath);

    // Click on save button to save the current app
    await window.getByTestId(Selectors.saveBtn).click();

    // Expect file path to exist
    expect(existsSync(savePath)).toBe(true);
  });

  test("Should load an app from local file system", async () => {
    test.setTimeout(60000);
    // Click on file button from right top nav bar
    await window.getByTestId(Selectors.fileBtn).click();

    // Mock showOpenDialogSynce to return app.json path
    const appPath = join(__dirname, "fixtures/app.json");
    await app.evaluate(async ({ dialog }, appPath) => {
      dialog.showOpenDialogSync = () => [appPath];
    }, appPath);

    // Click on Load button from file dropdown
    await window.getByTestId(Selectors.loadAppBtn).click();
    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/load-app.jpeg",
    });
    // Expect all blocks from the app.json file to be visible
    for (const block of blockApp.rfInstance.nodes) {
      const id = `rf__node-${block.id}`;
      await expect(window.getByTestId(id)).toBeVisible({ timeout: 15000 });
    }

    // // Take a screenshot
    // await window.screenshot({
    //   fullPage: true,
    //   path: "test-results/load-app.jpeg",
    // });
  });
});
