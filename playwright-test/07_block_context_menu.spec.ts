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
    await window.getByTestId(Selectors.contextEditBlockBtn).click();
    // Select all param div
    const params = await window.$$(
      `[data-testid="${Selectors.blockEditParam}"]`,
    );
    // Expect 5 parameters
    expect(params).toHaveLength(5);
    await window.getByTestId(Selectors.blockEditMenuCloseBtn).click();
  });

  test("Should open block info modal", async () => {
    // Right click on `SINE` block
    await window.locator("h2", { hasText: "SINE" }).click({
      button: "right",
    });

    await window.getByTestId(Selectors.contextBlockInfoBtn).click();
    // Expect dialog to be visible
    await expect(window.getByRole("dialog")).toBeVisible();

    // Expect "Python code" text in block modal
    await expect(
      window.locator("h2", { hasText: "Python code" }),
    ).toBeVisible();

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
    await expect(window.locator('[role="dialog"] > button')).toBeHidden();
  });

  test("Should delete a block", async () => {
    // Right click on `SINE` block
    await window.locator("h2", { hasText: "SINE" }).click({
      button: "right",
    });
    await window.getByTestId(Selectors.contextDeleteBlockBtn).click();
    await expect(window.locator("h2", { hasText: "SINE" })).toBeHidden();
  });

  test("Should duplicate a block", async () => {
    // Right click on `LINSPACE` block
    await window.locator("h2", { hasText: "LINSPACE" }).click({
      button: "right",
    });

    await window
      .getByTestId(Selectors.contextDuplicateBlockBtn)
      .click({ timeout: 2000 });
    await expect(window.locator("h2", { hasText: "LINSPACE 1" })).toBeVisible();
  });
});
