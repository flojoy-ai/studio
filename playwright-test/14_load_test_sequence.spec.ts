import { test, expect, Page, ElectronApplication } from "@playwright/test";
import { _electron as electron } from "playwright";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  mockDialogMessage,
  standbyStatus,
} from "./utils";
import { Selectors } from "./selectors";
import { join } from "path";


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

  test("Should load and run a sequence", async () => {
    // Load a complexe sequence
    const customSeqFile = join(__dirname, "fixtures/custom-sequences/complexe_sequence.tjoy");
    await app.evaluate(async ({ dialog }, customTestFile) => {
      dialog.showOpenDialogSync = () => { return [customTestFile]; }
    }, customSeqFile);
    await window.waitForTimeout(5000);

    // Ctrl/meta + o key shortcut to open a sequence
    if (process.platform === "darwin") {
      await window.keyboard.press("Meta+o");
    } else {
      await window.keyboard.press("Control+o");
    }

    // Expect sequence and tests to be loaded
    await expect(window.locator("div", { hasText: "test_one" }).first()).toBeVisible();
    await expect(window.locator("div", { hasText: "complexe_sequence" }).first()).toBeVisible();
    
    // Run the sequence
    await window.getByText("Run Test Sequences").click();
    await window.waitForTimeout(10000);

    // Check the status
    await expect(window.getByTestId(Selectors.globalStatusBadge)).toContainText("PASS");
  });

});
