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
import { existsSync, unlinkSync } from "fs";

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
    const homePath = await app.evaluate(async ({ app: _app }) => {
      return _app.getPath("home");
    });
    const blocksCachePath = join(homePath, ".flojoy/custom_blocks_path.txt");
    if (existsSync(blocksCachePath)) {
      try {
        unlinkSync(blocksCachePath);
      } catch (error) {
        //
      }
    }
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
    // Mock showSaveDialog to return customBlocksDir path
    const customBlocksDir = join(__dirname, "fixtures/custom-blocks");
    await app.evaluate(async ({ dialog }, customBlocksDir) => {
      dialog.showSaveDialog = () =>
        Promise.resolve({ filePaths: [customBlocksDir], canceled: false });
    }, customBlocksDir);

    // Click on 'Import custom blocks' button
    await window.getByTestId(Selectors.importCustomBlockBtn).click();

    // Expect `TEST_BLOCK` to be listed in sidebar
    await expect(
      window.locator("button", { hasText: "TEST_BLOCK" }).first(),
    ).toBeVisible();

    // Click on block to add it to flow chart
    await window.locator("button", { hasText: "TEST_BLOCK" }).first().click();

    // Expect `TEST_BLOCK` to visible in flow chart
    await expect(
      window.locator("h2", { hasText: "TEST_BLOCK" }).first(),
    ).toBeVisible();

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/import-block.jpeg",
    });
  });
});
