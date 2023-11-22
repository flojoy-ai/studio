import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
import fs from "fs";
import { join } from "path";
const { version } = JSON.parse(
  fs.readFileSync(join(process.cwd(), "package.json"), { encoding: "utf-8" }),
);

test("Startup test", async () => {
  const electronApp = await electron.launch({ args: ["./out/main/index.js"] });
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged;
  });

  expect(isPackaged).toBe(false);

  const window = await electronApp.firstWindow();
  await window.waitForLoadState("domcontentloaded");
  const title = await window.$("title");
  expect(await title?.innerText()).toContain("Flojoy Studio");
  const welcomeText = `Welcome to Flojoy Studio V${version}`;
  const locatorText = await window.getByText(welcomeText).innerText();
  expect(locatorText).toBe(welcomeText);
  // close app
  await electronApp.close();
});
