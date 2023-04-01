import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
import { NOISY_SINE } from "@src/data/RECIPES";
import { ControlNames } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

const nodes = NOISY_SINE.nodes.map((node) => ({
  selector: node.id,
  name: node.data.label.toLowerCase(),
}));

const ctrlParameters = [
  [
    { title: "Linspace ▶ START", value: 10 },
    { title: "Linspace ▶ END", value: 34 },
    { title: "Linspace ▶ STEP", value: 3000 },
    { title: "SINE ▶ FREQUENCY", value: 85 },
    { title: "SINE ▶ OFFSET", value: 0 },
    { title: "SINE ▶ AMPLITUDE", value: 25 },
    { title: "2.0 ▶ CONSTANT", value: 8 },
  ],
];

describe("user workflow", () => {
  it("Should load default flow chart", () => {
    Cypress.on("uncaught:exception", () => false);
    cy.visit("/", {
      onBeforeLoad(win: any) {
        win.disableIntercom = true;
      },
    }).wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });

    cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
      timeout: 1200000,
    });

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

    cy.get("[data-cy=add-ctrl]")
      .click()
      .get("button")
      .contains("Numeric Input")
      .first()
      .click();
    ctrlParameters.forEach((singleIter, index) => {
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

        // change parameter value
        cy.get("div").contains(item.title.toUpperCase(), { timeout: 1000 });
        cy.get(
          `input[type=${typeof item.value === "string" ? "text" : "number"}]`
        )
          .last()
          .click()
          .type(`{selectall}${item.value.toString()}`);
      });
    });

    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).contains("Play").click();
    cy.get(`[data-cy="btn-cancel"]`, { timeout: 15000 });
    cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
      timeout: 1200000,
    });

    cy.get("[data-testid=result-node]", { timeout: 20000 });
    cy.wait(5000);
    cy.get(`[data-cy="script-btn"]`).click();
    nodes.forEach((node) => {
      matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
    });
  });
});
