import { ControlNames } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

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

    cy.get("body").then(($body) => {
      if ($body.find(".ctrl-close-btn").length > 0) {
        cy.get(".ctrl-close-btn").click({ force: true });
      }
    });
    cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

    cy.get("[data-cy=operation-switch]")
      .contains("Edit")
      .click()
      .should("have.css", "color", "rgb(255, 165, 0)");

    cy.get("button[id=INPUT_PLACEHOLDER]").click();

    ctrlParameters.forEach((singleIter) => {
      singleIter.forEach((item) => {
        cy.get("[data-cy=add-ctrl]")
          .click()
          .get("button")
          .contains(
            typeof item.value === "string"
              ? ControlNames.TextInput
              : ControlNames.NumericInput
          )
          .first()
          .click();

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
