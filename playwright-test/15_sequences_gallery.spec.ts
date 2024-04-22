import { test, expect, Page, ElectronApplication } from "@playwright/test";
import { _electron as electron } from "playwright";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  mockDialogMessage,
  standbyStatus,
} from "./utils";
import { Selectors } from "./selectors";

test.describe("Load a demo test sequence", () => {
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
    // Switch to sequencer tab
    await window.getByTestId(Selectors.testSequencerTabBtn).click();
  });

  test.afterAll(async () => {
    await app.close();
  });

  test("Should load and run a sequence", async () => {
    await expect(window.getByTestId(Selectors.newDropdown)).toBeEnabled({
      timeout: 15000,
    });

    // Open the sequence gallery
    await window.getByTestId(Selectors.newDropdown).click();
    await window.getByTestId(Selectors.openSequenceGalleryBtn).click();

    // Open a sequence
    await window.getByTestId("test_step_with_expected_and_exported_values").nth(1).click();

    // Expect sequence and tests to be loaded
    await expect(
      window.locator("div", { hasText: "Export_&_Expected_Demo" }).first(),
    ).toBeVisible();

    // Expect test steps to bey loaded
    await expect(
      window.locator("div", { hasText: "test_min_max" }).first(),
    ).toBeVisible();

    // Run the sequence
    await window.getByTestId(Selectors.runBtn).click();
    await window.waitForTimeout(10000);

    // Check the status
    await expect(window.getByTestId(Selectors.globalStatusBadge)).toContainText(
      "FAIL",
    );
    await expect(window.getByTestId("status-test_min_max")).toContainText("PASS");
  });
});
