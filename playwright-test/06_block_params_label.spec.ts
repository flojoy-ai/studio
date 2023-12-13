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

test.describe("Block params and label", () => {
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
    await writeLogFile(app, "block-params");
    await app.close();
  });

  test("Should change SINE to TEST BLOCK", async () => {
    // Click on `SINE` block to select it
    await window.locator("h2", { hasText: "SINE" }).click();

    // Click on edit block button
    await window.getByTestId(Selectors.blockEditToggleBtn).click();

    // Click on edit labe button
    await window.getByTestId(Selectors.blockLabelEditBtn).click();

    // Clear input field
    await window.getByTestId(Selectors.blockLabelInput).clear();

    // Write "TEST BLOCK"
    await window.getByTestId(Selectors.blockLabelInput).fill("TEST BLOCK");

    // Click on submit button
    await window.getByTestId(Selectors.blockLabelSubmit).click();

    // Expect SINE block to be changed to "TEST BLOCK"
    await expect(window.locator("h2", { hasText: "TEST BLOCK" })).toBeVisible();
    await expect(window.locator("h2", { hasText: "SINE" })).toBeHidden();
  });

  test("Should change block parameter values", async () => {
    // Select all param div
    const params = await window.$$(
      `[data-testid="${Selectors.blockEditParam}"]`,
    );

    // Expect 5 parameters
    expect(params).toHaveLength(5);

    // Change AMPLITUDE value
    const amplitudeInput = await window.$('p:has-text("AMPLITUDE:") + input');
    await amplitudeInput?.fill("10", { force: true });

    // Change frequency value
    const frequencyInput = await window.$('p:has-text("FREQUENCY:") + input');
    await frequencyInput?.fill("10");

    // Change waveform value
    const waveformDropdown = await window.$('p:has-text("WAVEFORM:") + button');
    await waveformDropdown?.click();
    await window.getByText("sawtooth").click();

    // Take a screenshot
    await window.screenshot({
      fullPage: true,
      path: "test-results/sine-param.jpeg",
    });

    // Open block info modal
    await window.getByTestId(Selectors.blockInfoBtn).click();

    // Get block info
    const blockInfo = window.getByTestId(Selectors.blockInfoJson);
    const parsedInfo = await blockInfo.evaluate((elem) => {
      const info = elem.getAttribute("data-blockjson");
      return (info && JSON.parse(info)) || {};
    });

    // Expect parameter values to be changed
    expect(parsedInfo.data.ctrls.amplitude.value).toEqual(10);
    expect(parsedInfo.data.ctrls.frequency.value).toEqual(10);
    expect(parsedInfo.data.ctrls.waveform.value).toEqual("sawtooth");

    // Close the modal
    await window.locator('[role="dialog"] > button').click();
  });
});
