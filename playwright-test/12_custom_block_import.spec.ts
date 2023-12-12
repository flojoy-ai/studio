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
import blockApp from "./fixtures/app.json";

test.describe("Custom block import", () => {
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
    await writeLogFile(app, "custom-block-import");
    await app.close();
  });

  test("Should open custom blocks tab in sidebar", async () => {
    // Click on add block btn to expand blocks sidebar
    await expect(window.getByTestId(Selectors.sidebarExpandBtn)).toBeEnabled({
      timeout: 15000,
    });
    await window.getByTestId(Selectors.sidebarExpandBtn).click();

    // Click on custom blocks button to switch to custom blocks tab
    await window.getByTestId(Selectors.customBlocksTabBtn).click();

    // Expect "No custom blocks found" text to be visible
    await expect(
      window.getByText("No custom blocks found").first(),
    ).toBeVisible();
  });

  test("Should import custom blocks from local file system", async () => {
    // Click on Load button from file dropdown
    await window.getByTestId(Selectors.loadAppBtn).click();

    // Expect all blocks from the app.json file to be visible
    for (const block of blockApp.rfInstance.nodes) {
      const id = `rf__node-${block.id}`;
      await expect(window.getByTestId(id)).toBeVisible();
    }

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/import-block.jpeg",
    });
  });
});
