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
import blockApp from "./fixtures/app.json";

test.describe("Load app", () => {
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
    await writeLogFile(app, "load-app");
    await app.close();
  });

  test("Should load an app from local file system", async () => {
    // Click on file button from right top nav bar
    await window.getByTestId(Selectors.fileBtn).click();

    // Add handler to filechooser event to return app.json path
    window.on("filechooser", (filechooser) => {
      filechooser.setFiles(join(__dirname, "fixtures/app.json"));
    });

    // Click on Load button from file dropdown
    await window.getByTestId(Selectors.loadAppBtn).click();

    // Expect all blocks from the app.json file to be visible
    for (const block of blockApp.rfInstance.nodes) {
      const id = `rf__node-${block.id}`;
      await expect(window.getByTestId(id)).toBeVisible();
    }

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/load-app.jpeg",
    });
  });
});
