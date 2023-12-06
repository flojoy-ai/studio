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
import { data as appsGallery } from "../src/renderer/utils/GalleryLoader";

test.describe("Apps gallery", () => {
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
    await writeLogFile(app, "apps-gallery");
    await app.close();
  });

  test("Should open apps gallery modal", async () => {
    // Click on App Gallery button
    await window.getByTestId(Selectors.appGalleryBtn).click();

    // Expect modal to be visible
    await expect(window.getByRole("dialog")).toBeInViewport();

    // Evaluate app gallery title
    const hasAppGalleryTitle = await window.$$eval("div", (divs) => {
      return divs.some((div) => div.innerText === "App Gallery");
    });
    expect(hasAppGalleryTitle).toBe(true);

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
  });

  test("Should run apps", async () => {
    // Set test timeout to 10m as apps could take some time
    test.setTimeout(600000);

    // Define app categories to run on test
    const categoriesToRun = ["Fundamentals", "DSP"];

    // Define app names to exclude from test
    const excludeApps = ["Stream to Flojoy Cloud"];

    // Filter out categories
    const categories = Object.keys(appsGallery)
      .filter((cat) => categoriesToRun.includes(cat))
      .map((cat) => appsGallery[cat]);

    // Loop through categories
    for (const cat of categories) {
      for (const _app of cat) {
        // Continue if app name is present in excludeApps
        if (excludeApps.includes(_app.title)) {
          continue;
        }

        // Click on App Gallery button to open gallery modal
        await window.getByTestId(Selectors.appGalleryBtn).click();

        // Find and click on Load button
        await window.getByTestId(_app.title).click({ delay: 300 });

        try {
          // Close the modal
          await window
            .locator('[role="dialog"] > button')
            .click({ timeout: 1000 });
        } catch (error) {
          //
        }

        // Click on Play button to run the app
        await window.getByTestId(Selectors.playBtn).click();

        // Using try catch to avoid error as some apps can finish run rapidly
        try {
          // Ensure that Play button changed to cancel button
          await expect(
            window.getByTestId(Selectors.cancelPlayBtn),
          ).toBeVisible();
        } catch (error) {
          //
        }

        // Await for standby signal to be ensure that app run was successful
        await expect(
          window.locator("code", { hasText: standbyStatus }),
        ).toBeVisible({ timeout: 300000 });

        // Take a screenshot
        await window.screenshot({
          fullPage: true,
          path: `test-results/apps/${_app.title}.jpeg`,
        });
      }
    }
  });
});
