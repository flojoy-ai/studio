import {
  _electron as electron,
  test,
  ElectronApplication,
} from "@playwright/test";
import { getExecutablePath, killBackend, writeLogFile } from "./utils";
import { Selectors } from "./selectors";

test.describe("Apps testing", () => {
  let app: ElectronApplication;
  test.beforeAll(async () => {
    const executablePath = getExecutablePath();
    app = await electron.launch({
      executablePath,
    });
    app.on("close", () => {
      killBackend();
    });
  });

  test.afterAll(async () => {
    const logPath = await app.evaluate(async ({ app: _app }) => {
      return _app.getPath("logs");
    });
    writeLogFile(logPath, "app-testing");
    await app.close();
  });

  test("Run default app", async () => {
    // Set test timeout as this test is expected to be slow
    const timeoutSecond = 900000; // 15mins
    test.setTimeout(timeoutSecond);

    // Get electron BrowserWindow
    const window = await app.firstWindow();

    // Wait for DOM content to be loaded
    await window.waitForLoadState("domcontentloaded");

    // Wait for standby status, this indicates backend is up
    const standbyStatus = "🐢 awaiting a new job";
    await window.getByText(standbyStatus).innerText({ timeout: timeoutSecond });

    // Close the welcome modal
    await window.getByTestId(Selectors.closeWelcomeModalBtn).click();

    // Wait for manifest file to be fetched from backend
    const playBtn = window.getByTestId(Selectors.playBtn);
    await playBtn.isEnabled({ timeout: 10000 });

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
