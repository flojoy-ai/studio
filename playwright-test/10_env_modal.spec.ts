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

test.describe("Environment modal", () => {
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
    await writeLogFile(app, "env-modal");
    await app.close();
  });

  test("Should open environment setup modal", async () => {
    // Click on settings button
    await window.getByTestId(Selectors.settingsBtn).click();

    // Click on environment variables button from settings dropdown
    await window.getByTestId(Selectors.envModalBtn).click();

    // Expect a dialog to be visible in the Viewport
    await expect(window.getByRole("dialog")).toBeInViewport();

    // Expect "Environment Variables" title to be present
    await expect(
      window.locator("h2", { hasText: "Environment Variables" }),
    ).toBeVisible();
  });

  test("Should set flojoy cloud API key", async () => {
    test.setTimeout(60000);
    // Define a test API key
    const testAPIkey = "test-123";

    // Clear the flojoy cloud input and fill with testAPIkey
    await window.getByTestId(Selectors.flojoyCloudApiInput).clear();
    await window.getByTestId(Selectors.flojoyCloudApiInput).fill(testAPIkey);

    // Click on submit button
    await window.getByTestId(Selectors.flojoyCloudApiSubmit).click();

    try {
      // Expect "FLOJOY_CLOUD_WORKSPACE_SECRET" to be listed in the modal
      await expect(
        window.getByText("FLOJOY_CLOUD_WORKSPACE_SECRET"),
      ).toBeVisible({
        timeout: 20000,
      });
    } catch (error) {
      // #debug: Take a screenshot
      await window.screenshot({
        fullPage: true,
        path: "test-results/flojoy-cloud-api.jpeg",
      });
      throw new Error(error.message);
    }
  });

  test("Should set given Env key value", async () => {
    test.setTimeout(60000);
    // Define a API key
    const env = { key: "test-api", value: "test-123" };

    // Fill env variable key and value input
    await window.getByTestId(Selectors.envVarKeyInput).fill(env.key);
    await window.getByTestId(Selectors.envVarValueInput).fill(env.value);

    // Click on Add button
    await window.getByTestId(Selectors.envVarSubmitBtn).click();

    // Expect given env var listed in the modal
    await expect(window.getByText(env.key)).toBeVisible({ timeout: 20000 });

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/env-modal.jpeg",
    });
  });
});
