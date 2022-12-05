/* eslint-disable cypress/no-unnecessary-waiting */
import { matchPlotlyOutput } from "../utils/matchPlotlyOutput";

const nodes = [
  { selector: "LINSPACE-userGeneratedNode_1646432683694", name: "linspace" },
  { selector: "SINE-userGeneratedNode_1646417316016", name: "sine" },
  { selector: "RAND-userGeneratedNode_1646417371398", name: "rand" },
  { selector: "2.0-userGeneratedNode_1646435677928", name: "constant" },
  { selector: "MULTIPLY-userGeneratedNode_1646417352715", name: "multiply" },
  { selector: "ADD-userGeneratedNode_1646417428589", name: "add" },
  { selector: "SCATTER-userGeneratedNode_1646417560399", name: "scatter" },
  { selector: "HISTOGRAM-userGeneratedNode_1646417604301", name: "histogram" },
];

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

    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).click();
    cy.wait(5000)
    cy.get(`[data-cy="app-status"]`)
      .find("code").then($ele=>{
        cy.log(' server status: ' , $ele.text())
      });
      cy.get(`[data-cy="app-status"]`)
      .find("code").contains("🐢 awaiting a new job", { timeout: 60000 })

    cy.get("[data-testid=result-node]");

    cy.get(`[data-cy="script-btn"]`).click();

    nodes.forEach((node) => {
      cy.get(`[data-id="${node.selector}"]`).click({
        force: true,
        multiple: true,
      });
      matchPlotlyOutput(`${node.selector}`, "plotlyDefaultOutput");
      cy.get(".ctrl-close-btn").click({ force: true });
    });
  });
});
