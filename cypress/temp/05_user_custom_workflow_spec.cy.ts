//import { matchPlotlyOutput } from "../utils/matchPlotlyOutput";
//import { NOISY_SINE } from "../../src/data/RECIPES";
//
//const nodes = NOISY_SINE.nodes.map((node) => ({
//  selector: node.id,
//  name: node.data.label.toLowerCase(),
//}));
//
//const ctrlParameters = [
//  [
//    { title: "Linspace ▶ START", value: 10 },
//    { title: "Linspace ▶ END", value: 34 },
//    { title: "Linspace ▶ STEP", value: 3000 },
//    { title: "SINE ▶ FREQUENCY", value: 85 },
//    { title: "SINE ▶ OFFSET", value: 0 },
//    { title: "SINE ▶ AMPLITUDE", value: 25 },
//    { title: "2.0 ▶ CONSTANT", value: 8 },
//  ],
//];
//
//describe("user workflow", () => {
//  it("Should load default flow chart", () => {
//    Cypress.on("uncaught:exception", () => false);
//    cy.visit("/", {
//      onBeforeLoad(win: any) {
//        win.disableIntercom = true;
//      },
//    }).wait(1000);
//    cy.get("[data-testid=react-flow]", { timeout: 20000 });
//
//    cy.get(`[data-cy="app-status"]`)
//      .find("code")
//      .then(($ele) => {
//        if (
//          $ele.text().includes("🐢 awaiting a new job") ||
//          $ele.text().includes("⏰ server uptime:")
//        ) {
//          return true;
//        } else {
//          throw new Error("not correct status");
//        }
//      });
//
//    cy.get("body").then(($body) => {
//      if ($body.find("[data-cy=ctrl-close-btn]").length > 0) {
//        cy.get("[data-cy=ctrl-close-btn]").click({ force: true });
//      }
//    });
//    cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });
//
//    cy.get("[data-cy=edit-switch]").click();
//
//    cy.get("button[id=INPUT_PLACEHOLDER]").click();
//
//    // Expand sidebar tree first
//    cy.get("[data-cy=add-ctrl]").click();
//    cy.get("[data-cy=sidebar-section-btn]").filter(":visible").first().click();
//    cy.get("[data-testid=sidebar-sections]")
//      .contains("Continuous Variables")
//      .click();
//    cy.get("[data-testid=sidebar-sections]").contains("Text & Files").click();
//    cy.get("[data-testid=sidebar-close").filter(":visible").first().click();
//
//    ctrlParameters.forEach((singleIter) => {
//      singleIter.forEach((item) => {
//        cy.get("[data-cy=add-ctrl]").click();
//
//        const itemText =
//          typeof item.value === "string" ? "TEXT_INPUT" : "NUMERIC_INPUT";
//
//        cy.get("[data-testid=sidebar-sections]").contains(itemText).click();
//
//        // open dropdown list from input widget
//        cy.get("[id^=select-input-]")
//          .last()
//          .click({ force: true, multiple: true });
//        // Select current node parameter from dropdown list
//        cy.get('[id^="react-select-"][id$="-listbox"]')
//          .last()
//          .contains("div", item.title.toUpperCase())
//          .click({ force: true, multiple: true });
//
//        // change parameter value
//        cy.get("div").contains(item.title.toUpperCase(), { timeout: 1000 });
//        cy.get(
//          `input[type=${typeof item.value === "string" ? "text" : "number"}]`
//        )
//          .last()
//          .click()
//          .type(`{selectall}${item.value.toString()}`);
//      });
//    });
//
//    cy.get(`[data-cy="debug-btn"]`).click();
//
//    cy.get(`[data-cy="btn-play"]`).contains("Play").click();
//    cy.get(`[data-cy="btn-cancel"]`, { timeout: 15000 });
//    cy.get(`[data-cy="app-status"]`)
//      .find("code")
//      .contains("🐢 awaiting a new job", { timeout: 600000 });
//
//    cy.get("[data-testid=result-node]", { timeout: 20000 });
//    cy.wait(5000);
//    cy.get(`[data-cy="script-btn"]`).click();
//    nodes.forEach((node) => {
//      matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
//    });
//  });
//});
