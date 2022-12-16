/* eslint-disable cypress/no-unnecessary-waiting */
import { matchPlotlyOutput } from "../utils/matchPlotlyOutput";

const nodes = [
  { selector: "LINSPACE-userGeneratedNode_1646432683694", name: "linspace" },
  { selector: "SINE-userGeneratedNode_1646417316016", name: "sine" },
  { selector: "RAND-userGeneratedNode_1646417371398", name: "rand" },
  { selector: "CONSTANT-userGeneratedNode_1646435677928", name: "constant" },
  { selector: "MULTIPLY-userGeneratedNode_1646417352715", name: "multiply" },
  { selector: "ADD-userGeneratedNode_1646417428589", name: "add" },
  { selector: "SCATTER-userGeneratedNode_1646417560399", name: "scatter" },
  { selector: "HISTOGRAM-userGeneratedNode_1646417604301", name: "histogram" },
];


describe('User default workflow', ()=> {
  
      it("Should complete default workflow", () => {
        cy.visit("/", {onBeforeLoad (win:any) {
          win.disableIntercom = true;
        }});
        cy.get("[data-testid=react-flow]", { timeout: 20000 });;

        cy.get(`[data-cy="app-status"]`)
        .find('code')
        cy.get(`[data-cy="app-status"]`)
        .find('code').contains("🐢 awaiting a new job", {timeout: 5000});
      
        cy.get(`[data-cy="debug-btn"]`)
          .click();
      
        cy.get(`[data-cy="btn-play"]`).click();
      
        cy.get("[data-testid=result-node]", { timeout: 200000 });
      
        cy.get(`[data-cy="script-btn"]`)
          .click();
      
        nodes.forEach((node) => {
          cy.get(`[data-id="${node.selector}"]`).click({
            force: true,
            multiple: true,
          });
          matchPlotlyOutput(`${node.selector}`, "plotlyDefaultOutput");
          cy.get(".ctrl-close-btn").click({ force: true });
          });
      });
})