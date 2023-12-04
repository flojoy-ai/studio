import {
  _electron as electron,
  test,
  ElectronApplication,
  Page,
  expect,
} from "@playwright/test";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  killBackend,
  writeLogFile,
} from "./utils";
import { Selectors } from "./selectors";

test.describe("Add and delete blocks", () => {
  let app: ElectronApplication;
  let window: Page;
  test.beforeAll(async () => {
    test.setTimeout(STARTUP_TIMEOUT);
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
    window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    const standbyStatus = "🐢 awaiting a new job";
    await window
      .getByText(standbyStatus)
      .innerText({ timeout: STARTUP_TIMEOUT });
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();
    await window.getByTestId(Selectors.playBtn).isEnabled({ timeout: 15000 });
    app.on("close", () => {
      killBackend();
    });
  });

  test.afterAll(async () => {
    const logPath = await app.evaluate(async ({ app: _app }) => {
      return _app.getPath("logs");
    });
    writeLogFile(logPath, "add-delete-blocks");
    await app.close();
  });

  test("Clear canvas", async () => {
    // Click on clear canvas button
    await window.getByTestId(Selectors.clearCanvasBtn).click();

    // Confirm
    await window.getByTestId(Selectors.clearCanvasConfirmBtn).click();

    // Check for play button to be disabled, which indicates that
    // canvas is empty
    const playBtn = window.getByTestId(Selectors.playBtn);
    await playBtn.isDisabled({ timeout: 10000 });
  });

  test("Add a new block", async () => {
    // Check for manifest file to be fetched from backend
    const addBlockBtn = window.getByTestId(Selectors.addBlockBtn);
    await addBlockBtn.isEnabled({ timeout: 10000 });

    // Add two blocks from sidebar menu
    const blocks = ["LINSPACE", "SINE"];

    for (const block of blocks) {
      // Expand the sidebar menu
      await addBlockBtn.click({ delay: 500 });
      const sidebarInput = window.getByTestId(Selectors.sidebarInput);

      // Clear and fill sidebar input
      await sidebarInput.clear();
      await sidebarInput.fill(block);

      // Expand all blocks categories
      await window
        .getByTestId(Selectors.sidebarExpandBtn)
        .click({ clickCount: 2 });

      // Click on the block in the sidebar
      await window.getByText(block, { exact: true }).click();

      // Check if the block is visible in flow chart canvas
      const blockElem = window.locator("h2", { hasText: block });
      await expect(blockElem).toBeVisible({ timeout: 2000 });

      // Close the sidebar
      await window.getByTestId(Selectors.sidebarCloseBtn).click();
    }

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/add-block.jpg",
    });
  });

  test("Delete a block with Delete button", async () => {
    // Find and click on SINE block
    const sine = window.locator("h2", { hasText: "SINE" });
    await sine?.click({ noWaitAfter: true });

    // Click on edit block button
    const editBlockBtn = window.getByTestId(Selectors.blockEditToggleBtn);
    await editBlockBtn.isEnabled();
    await editBlockBtn.click();

    // Click on delete button from block edit menu
    await window.getByTestId(Selectors.deleteBlockBtn).click();

    // Expect block is removed from DOM element
    await expect(sine).toBeHidden({ timeout: 3000 });
  });

  test("Delete a block with Backspace key", async () => {
    // Click on Linspace block to select the block
    const linspace = window.locator("h2", { hasText: "LINSPACE" });
    await linspace.click();

    // Press Backspace from keyboard
    await window.keyboard.press("Backspace", { delay: 1000 });

    // Expect Linspace block to be removed from DOM element
    expect(linspace).toBeHidden({ timeout: 3000 });

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/delete-block.jpg",
    });
  });
});
