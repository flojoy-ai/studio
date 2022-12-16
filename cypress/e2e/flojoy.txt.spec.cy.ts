
import { matchPlotlyOutput } from 'cypress/utils/matchPlotlyOutput';
const nodes=[{'selector': 'SINE-userGeneratedNode_1646417316016', 'name': 'SINE'}, {'selector': 'MULTIPLY-userGeneratedNode_1646417352715', 'name': 'X'}, {'selector': 'RAND-userGeneratedNode_1646417371398', 'name': 'RAND'}, {'selector': 'ADD-userGeneratedNode_1646417428589', 'name': '+'}, {'selector': 'SCATTER-userGeneratedNode_1646417560399', 'name': 'SCATTER'}, {'selector': 'HISTOGRAM-userGeneratedNode_1646417604301', 'name': 'HISTOGRAM'}, {'selector': 'LINSPACE-userGeneratedNode_1646432683694', 'name': 'Linspace'}, {'selector': 'CONSTANT-userGeneratedNode_1646435677928', 'name': '10'}, {'selector': 'SCATTER3D-b63b2090-56f0-41c4-8048-1b34aa59c484', 'name': '3D Scatter'}, {'selector': 'SURFACE3D-5da867c0-be71-4f76-9f7c-5e53c0b7480d', 'name': '3D Surface'}, {'selector': 'LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b', 'name': 'Line'}, {'selector': 'BAR-6106326f-ff85-4940-9f5b-018381e2e2ce', 'name': 'Bar'}]

const ctrlParameters=[{'id': 'INPUT_PLACEHOLDER', 'nodeId': 'SINE-userGeneratedNode_1646417316016', 'functionName': 'SINE', 'title': 'SINE_SINE_frequency', 'value': 11}]

describe('User workflow for flojoy.txt app', ()=> {
    it("Should load flow chart with all nodes from the app.", () => {
      cy.visit("/?test_example_app=flojoy.txt", {
        onBeforeLoad(win: any) {
          win.disableIntercom = true;
        },
      });
      cy.get("[data-testid=react-flow]", { timeout: 20000 });
      nodes.forEach(node => {
        cy.get(`[data-id=${node.selector}]`)
      })
    });
    it("Should load all ctrl inputs from the app.", ()=>{
      cy.get('button').contains('CTRLS').click();
      cy.get("[data-cy=operation-switch]")
        .contains("Edit")
        .click()
        .should("have.css", "color", "rgb(255, 165, 0)");
      ctrlParameters.forEach(ctrl=>{
        cy.get(`[data-cy=${ctrl.id}]`)
      })
    })
    it("Should run the script successfully and show results in debug tab.", () => {
         cy.get(`[data-cy="app-status"]`)
        .find('code').contains("🐢 awaiting a new job", {timeout: 5000})

        cy.get("body").then($body => {
          if ($body.find(".ctrl-close-btn").length > 0) {   
            cy.get(".ctrl-close-btn").click({ force: true }); 
          }
        });

        Cypress.on("uncaught:exception", (err) => {
          cy.log('error occured: ', err)
          return false;
        });
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
          matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
          cy.get(".ctrl-close-btn").click({ force: true });
          });

  });
})

        