//import { NOISY_SINE } from "../../src/data/RECIPES";
//
//const nodes = NOISY_SINE.nodes.map((node) => ({
//  selector: node.id,
//  label: node.data.label.toLowerCase(),
//  funcName: node.data.func.toLowerCase(),
//}));
//describe("Script Tab Functionalities", () => {
//  it("check existance of a certain node in script tab", () => {
//    cy.visit("/").wait(1000);
//    cy.get("[data-testid=react-flow]", { timeout: 20000 });
//    nodes.forEach((node) => {
//      cy.get(`[data-id=${node.selector}]`).dblclick({
//        multiple: true,
//        force: true,
//      });
//      cy.contains("h1", node.funcName, { matchCase: false });
//      cy.get("[data-cy=ctrl-close-btn]").click({ force: true });
//    });
//  });
//});
//
//export {};
