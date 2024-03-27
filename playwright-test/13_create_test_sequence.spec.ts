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

test.describe("Create a test sequence", () => {
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

  test("Should import test steps", async () => {
    // Click on add tests to open modal
    await window.getByTestId(Selectors.addNewTestBtn).click();
    
    // Click on Pytest test to open modal
    await window.getByTestId(Selectors.pytestBtn).click();
    
    // Select the fixture file
    const customTestFile = join(__dirname, "fixtures/custom-sequences/test.py");
    await app.evaluate(async ({ dialog }, customTestFile) => {
      dialog.showOpenDialog = () =>
        Promise.resolve({ filePaths: [customTestFile], canceled: false });
    }, customTestFile);

    // Expect test to be loaded
    await expect(window.locator("div", { hasText: "test_one" }).first()).toBeVisible();

  });

  test("Should create a sequence", async () => {
  });

  test("Should run the sequence", async () => {
  });

  test("Should display the right status", async () => {
  });

});
