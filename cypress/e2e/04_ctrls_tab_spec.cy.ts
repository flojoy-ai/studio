import { ControlNames } from "../../src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

const ctrlParameters = [
  [
    { title: "Linspace ▶ START", value: 10 },
    { title: "Linspace ▶ END", value: 34 },
    { title: "Linspace ▶ STEP", value: 3000 },
    { title: "SINE ▶ FREQUENCY", value: 85 },
    { title: "SINE ▶ OFFSET", value: 0 },
    { title: "SINE ▶ AMPLITUDE", value: 25 },
    { title: "SINE ▶ WAVEFORM", value: "sine" },
    { title: "2.0 ▶ CONSTANT", value: 8 },
  ],
];

describe("Ctrl Tab management", () => {
  it("Should load default flow chart", () => {
    cy.on("uncaught:exception", () => false);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit("/");
    cy.get("[data-testid=react-flow]", { timeout: 20000 });
    cy.get(`[data-cy="app-status"]`)
      .find("code")
      .contains("🐢 awaiting a new job", { timeout: 5000 });

    // Force close any opened modal in homepage
    cy.get("body").then(($body) => {
      if ($body.find("[data-cy=ctrl-close-btn]").length > 0) {
        cy.get("[data-cy=ctrl-close-btn]").click({ force: true });
      }
    });

    // Switch to controls tab
    cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

    // Click the edit toggle
    cy.get("[data-cy=edit-switch]").click();

    cy.get("button[id=INPUT_PLACEHOLDER]").click();

    // Expand sidebar tree first
    // This is needed because the sidebar preserves state,
    // we want the numeric input and text input buttons to be visible.
    // Otherwise we would have to keep track of which buttons were
    // already clicked...
    cy.get("[data-cy=add-ctrl]").click();
    // cy.get("[data-testid=sidebar-sections]").find("button").first().click();
    cy.get("[data-cy=sidebar-section-btn]").filter(":visible").first().click();
    cy.get("[data-testid=sidebar-sections]")
      .contains("Continuous Variables")
      .click();
    cy.get("[data-testid=sidebar-sections]").contains("Text & Files").click();
    cy.get("[data-testid=sidebar-close").filter(":visible").first().click();

    ctrlParameters.forEach((singleIter) => {
      singleIter.forEach((item) => {
        cy.get("[data-cy=add-ctrl]").click();

        const itemText =
          typeof item.value === "string"
            ? ControlNames.TextInput
            : ControlNames.NumericInput;

        cy.get("[data-testid=sidebar-sections]").contains(itemText).click();

        // open dropdown list from input widget
        cy.get("[id^=select-input-]")
          .last()
          .click({ force: true, multiple: true });

        // Select current node parameter from dropdown list
        cy.get('[id^="react-select-"][id$="-listbox"]')
          .last()
          .contains("div", item.title.toUpperCase())
          .click({ force: true, multiple: true });

        // change parameter value to its default value
        cy.get("div").contains(item.title.toUpperCase(), { timeout: 1000 });
        cy.get(
          `input[type=${typeof item.value === "string" ? "text" : "number"}]`
        )
          .last()
          .click()
          .type(`{selectall}${item.value.toString()}`);
      });
    });
  });
});
export {};
