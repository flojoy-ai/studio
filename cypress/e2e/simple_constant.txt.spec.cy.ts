
import { matchPlotlyOutput } from 'cypress/utils/matchPlotlyOutput';
const nodes=[{'selector': 'ADD-userGeneratedNode_1646417428589', 'name': '+'}, {'selector': 'SCATTER-userGeneratedNode_1646417560399', 'name': 'SCATTER'}, {'selector': 'HISTOGRAM-userGeneratedNode_1646417604301', 'name': 'HISTOGRAM'}, {'selector': 'LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b', 'name': 'Line'}, {'selector': 'BAR-6106326f-ff85-4940-9f5b-018381e2e2ce', 'name': 'Bar'}, {'selector': 'CONSTANT-91c3bf6b-fbe5-46d7-bdd6-b971b2bc4b9c', 'name': '25'}, {'selector': 'MULTIPLY-4e5b66d6-0a7b-438d-ac65-81179d8c95fc', 'name': 'X'}, {'selector': 'CONSTANT-5d32f34c-8b62-44ea-b694-67a009cf02e5', 'name': '5'}, {'selector': 'CONSTANT-0ec34842-0495-4c54-98ca-244fd9e2040a', 'name': '4'}]

const ctrlParameters=[{'id': 'INPUT_PLACEHOLDER', 'nodeId': 'SINE-userGeneratedNode_1646417316016', 'functionName': 'SINE', 'title': 'SINE_SINE_frequency', 'value': 11}, {'id': 'ctrl-2df9e5a3-bd3b-4e38-815e-b6615a854c62', 'nodeId': 'SINE-userGeneratedNode_1646417316016', 'functionName': 'SINE', 'title': 'SINE_SINE_offset', 'value': 0}, {'id': 'ctrl-70283db9-c164-4d1f-9665-816e8ca5de13', 'nodeId': 'SINE-userGeneratedNode_1646417316016', 'functionName': 'SINE', 'title': 'SINE_SINE_amplitude', 'value': 1}, {'id': 'ctrl-6b8bf30a-534f-48aa-84f9-2917623e8d1c', 'nodeId': 'SINE-userGeneratedNode_1646417316016', 'functionName': 'SINE', 'title': 'SINE_SINE_waveform', 'value': 'sawtooth'}, {'id': 'ctrl-df9887fc-2e60-4daf-b094-d7f099989d83', 'nodeId': 'LINSPACE-userGeneratedNode_1646432683694', 'functionName': 'LINSPACE', 'title': 'LINSPACE_Linspace_end', 'value': 16}, {'id': 'ctrl-ef4dcf4e-ad8c-438f-9097-7446b7491561', 'nodeId': 'LINSPACE-userGeneratedNode_1646432683694', 'functionName': 'LINSPACE', 'title': 'LINSPACE_Linspace_step', 'value': '3001'}, {'id': 'ctrl-dc280f22-b5dd-4181-9914-294b540e99a5', 'nodeId': 'LINSPACE-userGeneratedNode_1646432683694', 'functionName': 'LINSPACE', 'title': 'LINSPACE_Linspace_start', 'value': 50}, {'id': 'ctrl-398b4b5c-3d59-4740-9ec3-7daf0bbdd529', 'nodeId': '2.0-userGeneratedNode_1646435677928', 'functionName': 'CONSTANT', 'title': 'CONSTANT_10_constant', 'value': '10'}]

describe('User workflow for simple_constant.txt app', ()=> {
    it("Should load flow chart with all nodes from the app.", () => {
      cy.visit("/?test_example_app=simple_constant.txt", {
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

        