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


describe('User default workflow', ()=> {
  
      it("Should load default flow chart", () => {
        cy.visit("/").wait(1000);
        cy.get("[data-testid=react-flow]", { timeout: 20000 });;
      });
    
      it("Wait for server to be ready to take new job.", () => {
        cy.wait(10000);
        cy.get(".App-status")
        .find('code')
        .then( ($ele) => {
          if ($ele.text().includes("🐢 awaiting a new job") || 
          $ele.text().includes("⏰ server uptime:")) {
              return true;
          } else {
            throw new Error("not correct status")
          }
        });
      });
    
      it("Switch to DEBUG tab", () => {
        cy.get(`[data-cy="debug-btn"]`)
          .click();
      });
    
      it("Run the app by clicking Play button", () => {
        cy.get("button").contains("Play").click().wait(5000);
      });
    
      it("Wait for job finishing", () => {
        cy.get("[data-testid=result-node]", { timeout: 200000 });
      });
    
      it("Switch to SCRIPT tab", () => {
        cy.get(`[data-cy="script-btn"]`)
          .click();
      });

      it("Click through all the charts and compare results with plotlyDefaultOutput.json", () => {
        nodes.forEach((node) => {
          cy.window().then(window => window.disableIntercom = true);
          cy.get(`[data-id="${node.selector}"]`).click({
            force: true,
            multiple: true,
          });
          matchPlotlyOutput(`${node.selector}`, "plotlyDefaultOutput");
          cy.get(".ctrl-close-btn").click({ force: true });
          });
      });
})