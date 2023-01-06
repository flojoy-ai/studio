import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
import { Elements } from "react-flow-renderer";
import {parameters as PARAMETERS} from '@src/data/manifests.json'

const exampleApps = [
  { title: "flojoy.txt" },
  { title: "flojoy_1.txt" },
];

describe("Example apps testing.", () => {
  exampleApps.forEach((app) => {
    describe(`User workflow for ${app.title}`, () => {
      it("Should load flow chart with all nodes from the app.", () => {
        cy.visit(`"/?test_example_app=${app.title}`, {
          onBeforeLoad(win: any) {
            win.disableIntercom = true;
          },
        });
      });
      it("Should switch to ctrl panel and add input widgets for each node parameters", () => {
        cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

        cy.get("[data-cy=operation-switch]")
          .contains("Edit")
          .click()
          .should("have.css", "color", "rgb(255, 165, 0)");
        cy.get("button").contains("x").click({ force: true, multiple: true });
        cy.get(`[data-testid=react-flow]`).then(($body) => {
          const elements = JSON.parse($body.attr("data-rfinstance")!);
          const nodes: Elements<ElementsData> = elements.filter(
            (elem: any) => !elem.source
          );
          nodes.forEach((node) => {
            const param: Record<string, any> = node.data!.ctrls;
            const nodeLabel = node.data!.label;
            if (Object.keys(param).length > 0) {
              Object.entries(param).forEach((entry) => {
                const [key, value] = entry;
                const paramName = key.split("_")[2].toUpperCase();
                const optionLabel = `${nodeLabel} ▶ ${paramName}`;
                const defaultValue =
                  PARAMETERS[node.data!?.func?.toUpperCase()][
                    paramName.toLowerCase()
                  ]["default"];
                cy.log("node: ", nodeLabel, " default: ", defaultValue);
                if (!isNaN(value.value)) {
                  cy.get("[data-cy=add-ctrl]")
                    .click()
                    .get("button")
                    .contains("Numeric Input")
                    .first()
                    .click();
                  cy.get("[id^=select-input-]")
                    .last()
                    .click({ force: true, multiple: true });
                  cy.get("[data-cy=ctrl-grid-item]")
                    .contains("div", optionLabel)
                    .click({ force: true, multiple: true });

                  cy.get("div").contains(optionLabel, { timeout: 1000 });
                  cy.get(`input[type=number]`)
                    .last()
                    .click()
                    .type(`{selectall}${defaultValue}`);
                } else {
                  cy.get("[data-cy=add-ctrl]")
                    .click()
                    .get("button")
                    .contains("Text Input")
                    .first()
                    .click();
                }
              });
            }
          });
        });
      });
      it("Should run the script successfully and show results in debug tab.", () => {
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 15000 });

        cy.get("body").then(($body) => {
          if ($body.find(".ctrl-close-btn").length > 0) {
            cy.get(".ctrl-close-btn").click({ force: true });
          }
        });

        Cypress.on("uncaught:exception", (err) => {
          cy.log("error occured: ", err);
          return false;
        });
        cy.get(`[data-cy="debug-btn"]`).click();

        cy.get(`[data-cy="btn-play"]`).click();
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 15000 });
        Cypress.on("uncaught:exception", (err) => {
          cy.log("error occured: ", err);
          return false;
        });

        cy.get("[data-testid=result-node]", { timeout: 200000 });

        cy.get(`[data-cy="script-btn"]`).click();
        cy.get(`[data-testid=react-flow]`).then(($body) => {
          const elements = JSON.parse($body.attr("data-rfinstance")!);
          const nodes: Elements<ElementsData> = elements.filter(
            (elem: any) => !elem.source
          );
          nodes.forEach((node) => {
            cy.get(`[data-id="${node.id}"]`).click({
              force: true,
              multiple: true,
            });
            matchPlotlyOutput(`${node.id}`, "plotlyCustomOutput");
            cy.get(".ctrl-close-btn").click({ force: true });
          });
        });
      });
    });
  });
});
