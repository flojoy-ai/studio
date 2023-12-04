import {
  _electron as electron,
  test,
  ElectronApplication,
  Page,
  expect,
} from "@playwright/test";
import { getExecutablePath, killBackend, writeLogFile } from "./utils";
import { Selectors } from "./selectors";

test.describe("Add and delete blocks", () => {
  let app: ElectronApplication;
  let window: Page;
  test.beforeAll(async () => {
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
    window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    const standbyStatus = "🐢 awaiting a new job";
    await window.getByText(standbyStatus).innerText({ timeout: 900000 });
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();
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
    await window.getByTestId(Selectors.clearCanvasBtn).click();
    await window.getByTestId(Selectors.clearCanvasConfirmBtn).click();
    const playBtn = window.getByTestId(Selectors.playBtn);
    await playBtn.isDisabled({ timeout: 10000 });
  });

  test("Add a new block", async () => {
    const timeoutSecond = 900000; // 15mins
    test.setTimeout(timeoutSecond);
    const addBlockBtn = window.getByTestId(Selectors.addBlockBtn);
    await addBlockBtn.isEnabled({ timeout: 10000 });
    const blocks = ["LINSPACE", "SINE"];

    for (const block of blocks) {
      await addBlockBtn.click({ delay: 500 });
      const sidebarInput = window.getByTestId(Selectors.sidebarInput);

      // Clear and fill sidebar input
      await sidebarInput.clear();
      await sidebarInput.fill(block);

      // Expand sidebar
      await window
        .getByTestId(Selectors.sidebarExpandBtn)
        .click({ clickCount: 2 });

      // Click on the block in the sidebar
      await window.getByText(block, { exact: true }).click();

      // Check if the block is present using $$eval
      const isBlockPresent = await window.$$eval(
        "h2",
        (elems, block) => {
          return elems.some((e) => e.innerText === block);
        },
        block,
      );
      expect(isBlockPresent).toEqual(true);

      // Close the sidebar
      await window.getByTestId(Selectors.sidebarCloseBtn).click();
    }

    await window.screenshot({
      fullPage: true,
      path: "test-results/add-block.jpg",
    });
  });

  test("Delete a block with Delete button", async () => {
    const sine = (await window.$$("h2")).find(
      async (el) => (await el.innerText()) === "SINE",
    );
    await sine?.click({ noWaitAfter: true });
    const editBlockBtn = window.getByTestId(Selectors.blockEditToggleBtn);
    await editBlockBtn.isEnabled();
    await editBlockBtn.click();
    await window.getByTestId(Selectors.deleteBlockBtn).click();
    await window.$$eval("h2", (elems) => {
      return !elems.some((e) => e.innerText === "SINE");
    });
  });

  test("Delete a block with Backspace key", async () => {
    const linspace = (await window.$$("h2")).find(
      async (el) => (await el.innerText()) === "LINSPACE",
    );
    await linspace?.click();
    await window.keyboard.press("Backspace");
    await window.$$eval("h2", (elems) => {
      return elems.find((e) => e.innerText === "LINSPACE") === undefined;
    });
    await window.screenshot({
      fullPage: true,
      path: "test-results/delete-block.jpg",
    });
  });
});
