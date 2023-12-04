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
    await window.getByTestId(Selectors.settingsBtn).click();
    await window.getByTestId(Selectors.keyboardShortcutBtn).click();
    expect(
      window.locator("h2", { hasText: "Keyboard Shortcuts" }),
    ).toBeVisible();
    await window.locator('[role="dialog"] > button').click();
  });
});
