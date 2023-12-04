import { test, expect, Page, ElectronApplication } from "@playwright/test";
import { _electron as electron } from "playwright";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  killBackend,
  standbyStatus,
  writeLogFile,
} from "./utils";
import { Selectors } from "./selectors";
import os from "os";
import { join } from "path";
import { existsSync } from "fs";

test.describe("Keyboard shortcuts", () => {
  let window: Page;
  let app: ElectronApplication;
  test.beforeAll(async () => {
    test.setTimeout(STARTUP_TIMEOUT);
    const executablePath = getExecutablePath();
    app = await electron.launch({ executablePath });
    window = await app.firstWindow();
    await expect(
      window.locator("code", { hasText: standbyStatus }),
    ).toBeVisible({ timeout: STARTUP_TIMEOUT });
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();
    app.on("close", () => {
      killBackend();
    });
  });

  test.afterAll(async () => {
    await writeLogFile(app, "Keyboard-shortcuts");
    await app.close();
  });

  test("Should show Keyboard shortcut modal", async () => {
    // Click on Settings button to open settings dropdown menu
    await window.getByTestId(Selectors.settingsBtn).click();

    // Click on keyboard shortcut button from dropdown menu
    await window.getByTestId(Selectors.keyboardShortcutBtn).click();

    // Expect keyboard shortcut modal to be visible in the Viewport
    expect(
      window.locator("h2", { hasText: "Keyboard Shortcuts" }),
    ).toBeVisible();

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
  });

  test("Ctrl/⌘ + P should run the app", async () => {
    // Check if Play button is enabled
    await window.getByTestId(Selectors.playBtn).isEnabled();

    // Press Ctrl/meta + p key
    if (process.platform === "darwin") {
      await window.keyboard.press("Meta+p");
    } else {
      await window.keyboard.press("Control+p");
    }
    // Check for cancel button to be visible, this indicates app is running.
    const cancelBtn = window.getByTestId(Selectors.cancelPlayBtn);
    await cancelBtn.waitFor({ state: "visible", timeout: 5000 });

    // Wait for the standby status to ensure that the app has finished running.
    await expect(
      window.locator("code", { hasText: standbyStatus }),
    ).toBeVisible({ timeout: 10000 });
  });

  test("Ctrl/⌘ + k should open block search dialog", async () => {
    // Press Ctrl/meta + k key
    if (process.platform === "darwin") {
      await window.keyboard.press("Meta+k");
    } else {
      await window.keyboard.press("Control+k");
    }

    // Wait for search modal to be visible
    await window
      .getByTestId(Selectors.commandInput)
      .waitFor({ state: "visible" });

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
  });

  //TODO: Blocks searchbar is not working correctly now.
  //   test("Block searchbar should work correctly", async()=>{
  //     await window.getByTestId(Selectors.commandInput).clear()
  //     await window.getByTestId(Selectors.commandInput).fill("LINSPACE");
  //     await expect(window.locator("div", {hasText:"LINSPACE"})).toBeVisible();
  //   })

  test("Ctrl/⌘ + s should prompt to choose location and save current app", async () => {
    const savePath = join(os.homedir(), "Downloads", "app.json");
    // Mock saveAs dialog and return a save path
    await app.evaluate(async ({ dialog }, savePath) => {
      dialog.showSaveDialog = () =>
        Promise.resolve({ filePath: savePath, canceled: false });
    }, savePath);

    // Press Ctrl/Meta + s key
    if (process.platform === "darwin") {
      await window.keyboard.press("Meta+s");
    } else {
      await window.keyboard.press("Control+s");
    }
    // Manually wait for 2 seconds for file to be save successfully
    await Promise.resolve(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      }),
    );

    // Expect file path to exist
    expect(existsSync(savePath)).toBe(true);
  });
});
