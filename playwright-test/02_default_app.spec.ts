import {
  _electron as electron,
  test,
  ElectronApplication,
} from "@playwright/test";
import {
  STARTUP_TIMEOUT,
  getExecutablePath,
  mockDialogMessage,
  writeLogFile,
} from "./utils";
import { Selectors } from "./selectors";

test.describe("Apps testing", () => {
  let app: ElectronApplication;
  test.beforeAll(async () => {
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
    await mockDialogMessage(app);
  });

  test.afterAll(async () => {
    await writeLogFile(app, "app-testing");
    await app.close();
  });

  test("Run default app", async () => {
    // Set test timeout as this test is expected to be slow
    test.setTimeout(STARTUP_TIMEOUT);

    // Get electron BrowserWindow
    const window = await app.firstWindow();

    // Wait for DOM content to be loaded
    await window.waitForLoadState("domcontentloaded");

    // Wait for standby status, this indicates backend is up
    const standbyStatus = "🐢 awaiting a new job";
    await window
      .getByText(standbyStatus)
      .innerText({ timeout: STARTUP_TIMEOUT });

    // Close the welcome modal
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();

    // Mock dialog to return 0 index
    await app.evaluate(async ({ dialog }) => {
      dialog.showMessageBoxSync = () => 0;
      dialog.showMessageBox = () =>
        Promise.resolve({ response: 0, checkboxChecked: false });
    });
    // Download blocks from main branch
    await window.getByTestId(Selectors.settingsBtn).click();
    await window.getByText("Download blocks from main").click();
    try {
      await window
        .getByTestId(Selectors.closeWelcomeModalBtn)
        .waitFor({ state: "visible", timeout: 120000 });
      await window.getByTestId(Selectors.closeWelcomeModalBtn).click();
    } catch (error) {
      //
    }

    // Wait for manifest file to be fetched from backend
    const playBtn = window.getByTestId(Selectors.playBtn);
    await playBtn.isEnabled({ timeout: 20000 });

    // Click play to run the default app
    await playBtn.click({ delay: 500 });

    // Check for cancel button to be visible, this indicates app is running.
    const cancelBtn = window.getByTestId(Selectors.cancelPlayBtn);
    await cancelBtn.waitFor({ state: "visible", timeout: 5000 });

    // Check for standby status again, this indicates app run was successful
    await window.getByText(standbyStatus).innerText({ timeout: 60000 });

    // Take a screenshot of the whole page
    await window.screenshot({
      fullPage: true,
      path: "test-results/default-app.jpg",
    });
  });
});
