/* eslint-disable cypress/no-unnecessary-waiting */
import { matchPlotlyOutput } from "../utils/matchPlotlyOutput";
import { NOISY_SINE } from "@src/data/RECIPES";

const nodes = NOISY_SINE.nodes.map((node) => ({
  selector: node.id,
  name: node.data.label.toLowerCase(),
}));

describe("User default workflow", () => {
  it("Should complete default workflow", () => {
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
    Cypress.on("uncaught:exception", (err) => {
      return false;
    });

    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).click();
    Cypress.on("uncaught:exception", (err) => {
      return false;
    });
    cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
      timeout: 60000,
    });
    Cypress.on("uncaught:exception", (err) => {
      return false;
    });
    cy.get("[data-testid=result-node]", { timeout: 60000 });

    cy.get(`[data-cy="script-btn"]`).click();
    Cypress.on("uncaught:exception", (err) => {
      return false;
    });
    nodes.forEach((node) => {
      matchPlotlyOutput(`${node.selector}`, "plotlyDefaultOutput");
    });
  });
});
