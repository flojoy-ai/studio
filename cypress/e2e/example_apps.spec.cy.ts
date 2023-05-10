import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
import { Node } from "reactflow";
import exampleApps from "./config_example_app_test.json";
import { ControlNames } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
interface IApp {
  title: string;
  test_id: string;
  nodes?: Array<{
    id: string;
    params: {
      [key: string]: string | number | boolean;
    };
  }>;
}

describe("Example apps testing.", () => {
  (exampleApps as IApp[]).forEach((app) => {
    describe(`User workflow for ${app.title} #${app.test_id}`, () => {
      it("Should load all nodes from the app and run successfully.", () => {
        cy.on("uncaught:exception", (err, runnable) => false);
        cy.visit(`"/?test_example_app=${app.title}`, {
          onBeforeLoad(win: any) {
            win.disableIntercom = true;
          },
        });
        /**
         * verify all the nodes are created in the flow chart editor
         */
        cy.get(`[data-testid=react-flow]`).then(($body) => {
          const nodes: Node<ElementsData>[] = JSON.parse(
            $body.attr("data-rfinstance")!
          );
          nodes.forEach((node) => {
            cy.get(`[data-id="${node.id}"]`);
          });
        });
        // Switch to ctrl panel tab
        cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

        // Enable operation mode
        cy.get("[data-cy=operation-switch]")
          .contains("Edit")
          .click()
        /**
         * For each parameter of every nodes create input widget
         * and set default value
         */
        cy.get(`[data-testid=react-flow]`).then(($elem) => {
          // collect the node elements
          const nodes: Node<ElementsData>[] = JSON.parse(
            $elem.attr("data-rfinstance")!
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
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 60000 });

        // force close any opened modal in homepage
        cy.get("body").then(($body) => {
          if ($body.find(".ctrl-close-btn").length > 0) {
            cy.get(".ctrl-close-btn").click({ force: true });
          }
        });
        // Switch to debug panel
        cy.get(`[data-cy="debug-btn"]`).click();
        // Run the script
        cy.get(`[data-cy="btn-play"]`).click();
        cy.get(`[data-cy="btn-cancel"]`, { timeout: 15000 });
        // wait for job to finish
        cy.get(`[data-cy="app-status"]`)
          .find("code")
          .contains("🐢 awaiting a new job", { timeout: 65000 });
        // Check if the debug flow chart is constructed and visible
        cy.get("[data-testid=result-node]", { timeout: 200000 });
        cy.wait(5000);
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
  cy.get('[id^="react-select-"][id$="-listbox"]')
    .last()
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
  node: Node<ElementsData>,
  nodeLabel: string,
  param: [string, any],
  app: IApp
) => {
  const [paramName, paramValue] = param;
  // It assumes key is formatted as functionName_nodeLabel_paramName
  const optionLabel = `${nodeLabel} ▶ ${paramName.toUpperCase()}`;
  const defaultValue = paramValue.value;
  let pValue: any = "";
  if (app.nodes) {
    const getNode = app.nodes.find((n) => n.id === node.id);
    pValue = getNode
      ? paramName.toLowerCase() in getNode.params
        ? getNode.params[paramName.toLowerCase()]
        : 0
      : 0;
  }
  const providedValue = pValue || defaultValue;
  // if value is numeric
  if (!isNaN(paramValue.value)) {
    createInputWidget(ControlNames.NumericInput, optionLabel, providedValue);
  } else if (typeof paramValue.value === "string") {
    createInputWidget(ControlNames.TextInput, optionLabel, providedValue);
  }
};
