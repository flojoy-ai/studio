import {
  _electron as electron,
  test,
  ElectronApplication,
} from "@playwright/test";
import { getExecutablePath, killBackend, writeLogFile } from "./utils";

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
    const timeoutSecond = 900000; // 15mins
    test.setTimeout(timeoutSecond);
    const window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    const standbyStatus = "🐢 awaiting a new job";
    await window.getByText(standbyStatus).innerText({ timeout: timeoutSecond });
    await window.getByTestId("close-welcome-modal").click();
    const playBtn = window.getByTestId("btn-play");
    await playBtn.isEnabled({ timeout: 10000 });
    await playBtn.click({ delay: 500 });
    const cancelBtn = window.getByTestId("btn-cancel");
    await cancelBtn.waitFor({ state: "visible", timeout: 5000 });
    await window.getByText(standbyStatus).innerText({ timeout: 60000 });
  });
});
