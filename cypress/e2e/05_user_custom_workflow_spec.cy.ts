import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
import { NOISY_SINE } from "@src/data/RECIPES";

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
    // { title: "SINE ▶ WAVEFORM", value: "sine" },
    { title: "2.0 ▶ CONSTANT", value: 8 },
  ],
];

describe("user workflow", () => {
  it("Should load default flow chart", () => {
    cy.visit("/", {
      onBeforeLoad(win: any) {
        win.disableIntercom = true;
      },
    }).wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });

    cy.get(`[data-cy="app-status"]`)
      .find("code")
      .then(($ele) => {
        if (
          $ele.text().includes("🐢 awaiting a new job") ||
          $ele.text().includes("⏰ server uptime:")
        ) {
          return true;
        } else {
          throw new Error("not correct status");
        }
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

    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.get("button[id=INPUT_PLACEHOLDER]").click();

    cy.get("[data-cy=add-ctrl]")
      .click()
      .get("button")
      .contains("Numeric Input")
      .first()
      .click();
    ctrlParameters.forEach((singleIter, index) => {
      singleIter.forEach((item) => {
        cy.get("[data-cy=ctrls-select]").click();
        cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {
          cy.contains(`${item.title}`).click({ force: true });
          if (item.title === "SINE ▶ WAVEFORM") {
            return cy
              .get(`input[value="${item.value}"]`)
              .check(item.value.toString());
          }
          return cy
            .get(`input[type=number]`)
            .click()
            .type(`{selectall}${item.value.toString()}`);
        });
      });
    });

    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).contains("Play").click();
    cy.get(`[data-cy="app-status"]`)
      .find("code")
      .contains("🐢 awaiting a new job", { timeout: 600000 });

    cy.get("[data-testid=result-node]", { timeout: 20000 });

    cy.get(`[data-cy="script-btn"]`).click();

    nodes.forEach((node) => {
      cy.get(`[data-id="${node.selector}"]`).dblclick({
        force: true,
        multiple: true,
      });
      matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
      cy.get(".ctrl-close-btn").click({ force: true });
      cy.wait(3000);
    });
  });
});
