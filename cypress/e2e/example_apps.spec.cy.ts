import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
import { Elements } from "react-flow-renderer";
import exampleApps from "./config_example_app_test.json";
import { ControlNames } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

describe("Example apps testing.", () => {
  exampleApps.forEach((app) => {
    describe(`User workflow for ${app.title} #${app.test_id}`, () => {
      it("Should load flow chart with all nodes from the app.", () => {
        cy.visit(`"/?test_example_app=${app.title}`, {
          onBeforeLoad(win: any) {
            win.disableIntercom = true;
          },
        });
        /**
         * verify all the nodes are created in the flow chart editor
         */
        cy.get(`[data-testid=react-flow]`).then(($body) => {
          const elements = JSON.parse($body.attr("data-rfinstance")!);
          const nodes: Elements<ElementsData> = elements.filter(
            (elem: any) => !elem.source
          );
          nodes.forEach((node) => {
            cy.get(`[data-id="${node.id}"]`);
          });
        });
      });
      it("Should switch to ctrl panel and add input widgets for each node parameters", () => {
        // Switch to ctrl panel tab
        cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

        // Enable operation mode
        cy.get("[data-cy=operation-switch]")
          .contains("Edit")
          .click()
          .should("have.css", "color", "rgb(255, 165, 0)");

        // Force close if any default widgets are there
        cy.get("button").contains("x").click({ force: true, multiple: true });

        /**
         * For each parameter of every nodes create input widget
         * and set default value
         */
        cy.get(`[data-testid=react-flow]`).then(($elem) => {
          const elements = JSON.parse($elem.attr("data-rfinstance")!);
          // collect the node elements
          const nodes: Elements<ElementsData> = elements.filter(
            (elem: any) => !elem.source
          );
          nodes.forEach((node) => {
            const nodeParams: Record<string, any> = node.data!.ctrls;
            const nodeLabel = node.data!.label;
            if (Object.keys(nodeParams).length > 0) {
              Object.entries(nodeParams).forEach((param) => {
                createWidgetForNodeParam(node, nodeLabel, param, app);
              });
            }
          });
        });
      });
      it("Should run the script successfully and show results in debug tab.", () => {
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 15000 });

        // force close any opened modal in homepage
        cy.get("body").then(($body) => {
          if ($body.find(".ctrl-close-btn").length > 0) {
            cy.get(".ctrl-close-btn").click({ force: true });
          }
        });

        Cypress.on("uncaught:exception", (err) => {
          cy.log("error occured: ", err);
          return false;
        });
        // Switch to debug panel
        cy.get(`[data-cy="debug-btn"]`).click();
        // Run the script
        cy.get(`[data-cy="btn-play"]`).click();
        // wait for job to finish
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 15000 });
        Cypress.on("uncaught:exception", (err) => {
          cy.log("error occured: ", err);
          return false;
        });
        // Check if the debug flow chart is constructed and visible
        cy.get("[data-testid=result-node]", { timeout: 200000 });
        matchPlotlyOutput();
      });
    });
  });
});

const createInputWidget = (
  inputName: ControlNames,
  optionLabel: string,
  providedValue: string | number
) => {
  // Open add ctrl modal and add numeric input widget
  cy.get("[data-cy=add-ctrl]")
    .click()
    .get("button")
    .contains(inputName)
    .first()
    .click();
  // open dropdown list from input widget
  cy.get("[id^=select-input-]").last().click({ force: true, multiple: true });
  // Select current node parameter from dropdown list
  cy.get("[data-cy=ctrl-grid-item]")
    .contains("div", optionLabel)
    .click({ force: true, multiple: true });
  // change parameter value to its default value
  cy.get("div").contains(optionLabel, { timeout: 1000 });
  cy.get(
    `input[type=${inputName === ControlNames.NumericInput ? "number" : "text"}]`
  )
    .last()
    .click()
    .type(`{selectall}${providedValue}`);
};

const createWidgetForNodeParam = (
  node: any,
  nodeLabel: string,
  param: any,
  app: any
) => {
  const [paramKey, paramValue] = param;
  // It assumes key is formatted as functionName_nodeLabel_paramName
  const paramName = paramKey.split("_")[2].toUpperCase();
  const optionLabel = `${nodeLabel} ▶ ${paramName}`;
  const defaultValue = paramValue.value;

  const providedValue =
    (app.nodes as any[])?.find((n) => n.id === node.id)?.params[
      paramName.toLowerCase()
    ] || defaultValue;
  // if value is numeric
  if (!isNaN(paramValue.value)) {
    createInputWidget(ControlNames.NumericInput, optionLabel, providedValue);
  } else if (typeof paramValue.value === "string") {
    createInputWidget(ControlNames.TextInput, optionLabel, providedValue);
  }
};
