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
import { existsSync } from "fs";

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

  test("Should import and run test steps", async () => {
    // Click on add tests to open modal
    await expect(window.getByText("Add New Tests")).toBeEnabled({
      timeout: 15000,
    });
    await window.getByText("Add New Tests").click();
    
    // Select the fixture file
    const customTestFile = join(__dirname, "fixtures/custom-sequences/test.py");
    await app.evaluate(async ({ dialog }, customTestFile) => {
      dialog.showOpenDialogSync = () => { return [customTestFile]; }
    }, customTestFile);

        
    // Click on Pytest test to open modal
    await window.getByTestId(Selectors.pytestBtn).click();

    // Expect test to be loaded
    await expect(window.locator("div", { hasText: "test_one" }).first()).toBeVisible();

    // Run the test and check the status
    await window.getByText("Run Test Sequence").click();
    await window.waitForTimeout(10000);
    await expect(window.getByTestId("global-status-badge")).toContainText("FAIL");
  });

  test("Should create a sequence", async () => {
    // Click on add tests to open modal
    await expect(window.getByText("Add New Tests")).toBeEnabled({
      timeout: 15000,
    });
    await window.getByText("Add New Tests").click();
    
    // Select the fixture file
    const customTestFile = join(__dirname, "fixtures/custom-sequences/test.py");
    await app.evaluate(async ({ dialog }, customTestFile) => {
      dialog.showOpenDialogSync = () => { return [customTestFile]; }
    }, customTestFile);

        
    // Click on Pytest test to open modal
    await window.getByTestId(Selectors.pytestBtn).click();

    // Expect test to be loaded
    await expect(window.locator("div", { hasText: "test_one" }).first()).toBeVisible();

    // Ctrl/meta + p key shortcut to save the sequence
    if (process.platform === "darwin") {
      await window.keyboard.press("Meta+s");
    } else {
      await window.keyboard.press("Control+s");
    }
    const root = join(__dirname, "fixtures/custom-sequences/");
    const savePath = join(__dirname, "fixtures/custom-sequences/seq_example.tjoy");
    await window.getByTestId(Selectors.newSeqModalNameInput).fill("seq_example");
    await window.getByTestId(Selectors.newSeqModalDescInput).fill("Playwrite test sequence");
    await window.getByTestId(Selectors.newSeqModalRootInput).fill(root);
    await window.getByTestId(Selectors.newSeqModalCreateButton).click();

    // Check if saved sequence exists
    expect(existsSync(savePath)).toBe(true);

    // Run the sequence and check the status
    await window.getByText("Run Test Sequence").click();
    await window.waitForTimeout(10000);
    await expect(window.getByTestId("global-status-badge")).toContainText("FAIL");
  });

  test("Should run the sequence", async () => {
    // Load a complexe sequence
    const customSeqFile = join(__dirname, "fixtures/custom-sequences/complexe_sequence.tjoy");
    await app.evaluate(async ({ dialog }, customTestFile) => {
      dialog.showOpenDialogSync = () => { return [customTestFile]; }
    }, customSeqFile);
    
    // Run the sequence
    await window.getByText("Run Test Sequence").click();
    await window.waitForTimeout(10000);

    // Check the status
    await expect(window.getByTestId("global-status-badge")).toContainText("PASS");
  });

});