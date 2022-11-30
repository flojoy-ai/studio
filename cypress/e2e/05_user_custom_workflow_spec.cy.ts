// /* eslint-disable cypress/no-unnecessary-waiting */

// const nodes = [
//   { selector: "LINSPACE-userGeneratedNode_1646432683694", name: "linspace" },
//   { selector: "SINE-userGeneratedNode_1646417316016", name: "sine" },
//   { selector: "RAND-userGeneratedNode_1646417371398", name: "rand" },
//   { selector: "2.0-userGeneratedNode_1646435677928", name: "constant" },
//   { selector: "MULTIPLY-userGeneratedNode_1646417352715", name: "multiply" },
//   { selector: "ADD-userGeneratedNode_1646417428589", name: "add" },
//   { selector: "SCATTER-userGeneratedNode_1646417560399", name: "scatter" },
//   { selector: "HISTOGRAM-userGeneratedNode_1646417604301", name: "histogram" },
// ];

// const ctrlParameters = [
//   [
//     { title: "Linspace ▶ START", value: 10 },
//     { title: "Linspace ▶ END", value: 34 },
//     { title: "Linspace ▶ STEP", value: 3000 },
//     { title: "SINE ▶ FREQUENCY", value: 85 },
//     { title: "SINE ▶ OFFSET", value: 0 },
//     { title: "SINE ▶ AMPLITUDE", value: 25 },
//     // { title: "SINE ▶ WAVEFORM", value: "sine" },
//     { title: "2.0 ▶ CONSTANT", value: 8 },
//   ],
//   // [
//   //   { title: "LINSPACE ▶ START", value: "5" },
//   //   { title: "LINSPACE ▶ END", value: "20" },
//   //   { title: "LINSPACE ▶ STEP", value: "2" },
//   //   { title: "SINE ▶ FREQUENCY", value: "5" },
//   //   { title: "SINE ▶ OFFSET", value: "2" },
//   //   { title: "SINE ▶ AMPLITUDE", value: "5" },
//   //   { title: "SINE ▶ WAVEFORM", value: "square" },
//   //   { title: "8 ▶ CONSTANT", value: "5" },
//   // ],
// ];

// describe('user workflow', ()=> {
//     it("Should load default flow chart", () => {
//         cy.visit("/").wait(1000);
//         cy.get("[data-testid=react-flow]", { timeout: 20000 });;
//       });
    
//       it("Wait for server to be ready to take new job.", () => {
//         cy.wait(10000);
//         cy.get(`[data-cy="app-status"]`)
//         .find('code')
//         .then( ($ele) => {
//           if ($ele.text().includes("🐢 awaiting a new job") || 
//           $ele.text().includes("⏰ server uptime:")) {
//               return true;
//           } else {
//             throw new Error("not correct status")
//           }
//         });
//       });

//   it("Switch to ctrls tab upon clicking on CTRLS button.", () => {
//     cy.get("body").then($body => {
//       if ($body.find(".ctrl-close-btn").length > 0) {   
//         cy.get(".ctrl-close-btn").click({ force: true }); 
//       }
//     });
//     cy.get(`[data-cy="ctrls-btn"]`)
//       .click({timeout : 10000});
//   });

//   it("Enable operation mode by clicking on Edit switch button", () => {
//     cy.get("[data-cy=operation-switch]")
//       .contains("Edit")
//       .click()
//       .should("have.css", "color", "rgb(255, 165, 0)");
//   });

//   it("Remove existing ctrl grid.", () => {
//     Cypress.on('uncaught:exception', (err, runnable) => {
//       return false
//     })
//     cy.get("button[id=INPUT_PLACEHOLDER]").click();
//   });

//   it("For different variations of inputs, Change inputs value.", () => {
//     cy.get("[data-cy=add-ctrl]").click().get("button").contains("Numeric Input").first().click();
//     ctrlParameters.forEach((singleIter, index) => {
//       singleIter.forEach((item) => {
//         cy.get("[data-cy=ctrls-select]").click();
//         cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {
//           cy.contains(`${item.title}`).click({force: true});
//           if (item.title === "SINE ▶ WAVEFORM") {
//             return cy
//               .get(`input[value="${item.value}"]`)
//               .check(item.value.toString());
//           }
//           return cy
//             .get(`input[type=number]`)
//             .click()
//             .type(`{selectall}${item.value.toString()}`)
//         });
//       });
//     });
//   });
  
//   it("Wait for current job to finish", () => {
//     cy.get(".App-status").contains("🐢 awaiting a new job", {
//       timeout: 60000,
//     });
//   });

//   it("Switch to DEBUG tab", () => {
//     cy.get(`[data-cy="debug-btn"]`)
//       .click();
//   });

//   it("Run the app by clicking Play button", () => {
//     cy.get(`[data-cy="btn-play"]`).contains("Play").click().wait(5000);
//   });

//   it("Wait for current job to finish", () => {
//     cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
//       timeout: 60000,
//       matchCase: false
//     });
//   });

//   it("Wait 5 sec to reflect current changes on plotly", () => {
//     cy.wait(5000);
//   });

//   // it("Compare new results with plotlyCustomResults.json", () => {
//   //   nodes.forEach((node) => {
//   //     matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
//   //   });
//   // });
// })