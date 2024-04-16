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

test.describe("Block context menu", () => {
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
    await writeLogFile(app, "block-context-menu");
    await app.close();
  });

  test("Should open a context menu upon right clicking", async () => {
    // Wait for blocks metadata file to be fetched from backend
    await expect(window.locator('[data-blockmetadata="true"]')).toBeVisible({
      timeout: 20000,
    });

    // Right click on `SINE` block
    await window.locator("h2", { hasText: "SINE" }).click({
      button: "right",
    });

    // Expect block context menu to be visible
    await expect(
      window.getByTestId(Selectors.blockContextMenuDiv),
    ).toBeVisible();
  });

  test("Should open block edit menu upon clicking Edit block", async () => {
    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/before-right-click-block.jpeg",
    });

    // CI problem if not center due to multi-layered context menu
    await window.locator("button[title='zoom out']").click();
    await window.locator("button[title='zoom out']").click();
    await window.locator("button[title='zoom out']").click();
    await window.locator("button[title='fit view']").click();
    //
    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/before-right-click-block-After-Zoom.jpeg",
    });


    // Click on Edit block button from context menu
    await window.getByTestId(Selectors.contextEditBlockBtn).click();

    // Select all param div
    const params = await window.$$(
      `[data-testid="${Selectors.blockEditParam}"]`,
    );

    // Expect 5 parameters for SINE block
    expect(params).toHaveLength(5);

    // Close the block edit menu
    await window.getByTestId(Selectors.blockEditMenuCloseBtn).click();
  });

  test("Should open block info modal", async () => {
    // Right click on `SINE` block
    await window.locator("h2", { hasText: "SINE" }).click({
      button: "right",
    });

    // Click on Block info button from context menu
    await window.getByTestId(Selectors.contextBlockInfoBtn).click();

    // Expect a dialog to be visible
    await expect(window.getByRole("dialog")).toBeVisible();

    // Expect "Python code" text in block modal
    await expect(
      window.locator("h2", { hasText: "Python code" }),
    ).toBeVisible();

    // Close the modal
    await window.getByRole("button", { name: "Close" }).first().click();

    // Ensure that modal is closed
    await expect(window.getByRole("button", { name: "Close" })).toBeHidden();
  });

  test("Should delete a block", async () => {
    // Right click on `SINE` block
    await window.locator("h2", { hasText: "SINE" }).click({
      button: "right",
    });

    // Click on Delete block button from context menu
    await window.getByTestId(Selectors.contextDeleteBlockBtn).click();

    // Expect SINE block to disappear from DOM
    await expect(window.locator("h2", { hasText: "SINE" })).toBeHidden();
  });

  test("Should duplicate a block", async () => {
    // Right click on `LINSPACE` block
    await window.locator("h2", { hasText: "LINSPACE" }).click({
      button: "right",
    });

    // Click on Duplicate block button from context menu
    await window
      .getByTestId(Selectors.contextDuplicateBlockBtn)
      .click({ timeout: 2000 });

    // Expect a new block named 'LINSPACE 1' is visible in flow chart
    await expect(window.locator("h2", { hasText: "LINSPACE 1" })).toBeVisible();

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/duplicate-block.jpeg",
    });
  });
});
