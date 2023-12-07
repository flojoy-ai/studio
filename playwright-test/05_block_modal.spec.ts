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

test.describe("Block modal", () => {
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
    await writeLogFile(app, "Block-modal");
    await app.close();
  });

  test("Should show LINSPACE block modal", async () => {
    // Click on `LINSPACE` block to select it
    await window.locator("h2", { hasText: "LINSPACE" }).click();

    // Click on edit block button
    await window.getByTestId(Selectors.blockEditToggleBtn).click();

    // Click on block info button
    await window.getByTestId(Selectors.blockInfoBtn).click();

    // Expect dialog to be visible
    await expect(window.getByRole("dialog")).toBeVisible();

    // Expect "Python code" text in block modal
    await expect(
      window.locator("h2", { hasText: "Python code" }),
    ).toBeVisible();

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/linspace-block-modal.jpeg",
    });

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
  });
});
