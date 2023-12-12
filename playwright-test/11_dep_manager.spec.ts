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

test.describe("Dependency Manager modal", () => {
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
    await writeLogFile(app, "dep-manager-modal");
    await app.close();
  });

  test("Should open Dependency Manager modal", async () => {
    // Click on settings button
    await window.getByTestId(Selectors.settingsBtn).click();

    // Click on dependency manager button from settings dropdown
    await window.getByTestId(Selectors.depManagerModalBtn).click();

    // Expect a dialog to be visible in the Viewport
    await expect(window.getByRole("dialog")).toBeInViewport();

    // Expect "Dependency Manager" title to be present
    await expect(
      window.locator("h2", { hasText: "Dependency Manager" }).first(),
    ).toBeVisible();

    // Expect dependency information is fetched from backend
    await expect(
      window.locator("div", { hasText: "Dependency Manager Idle" }).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("Should install dev group dependency", async () => {
    // Click on install button for dev group
    await expect(window.getByTestId("dev-Install")).toBeVisible();
    await window.getByTestId("dev-Install").click();

    // Wait for "Dependency manager idle" status
    await expect(
      window.locator("div", { hasText: "Dependency Manager Idle" }).first(),
    ).toBeVisible({ timeout: 30000 });

    // Expect dev group dependency is listed
    await expect(
      window.locator("tr", { hasText: "ruff" }).first(),
    ).toBeVisible();
  });

  test("Should uninstall dev group dependency", async () => {
    // Click on uninstall button for dev group
    await expect(window.getByTestId("dev-Uninstall")).toBeVisible();
    await window.getByTestId("dev-Uninstall").click();

    // Wait for "Dependency manager idle" status
    await expect(
      window.locator("div", { hasText: "Dependency Manager Idle" }).first(),
    ).toBeVisible({ timeout: 30000 });

    // Expect dev group dependency is removed from package list
    await expect(
      window.locator("tr", { hasText: "ruff" }).first(),
    ).toBeHidden();
  });
});
