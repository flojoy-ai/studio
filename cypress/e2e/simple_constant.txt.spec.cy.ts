import { matchPlotlyOutput } from "cypress/utils/matchPlotlyOutput";
const nodes = [
  { selector: "ADD-userGeneratedNode_1646417428589", name: "+" },
  { selector: "SCATTER-userGeneratedNode_1646417560399", name: "SCATTER" },
  { selector: "HISTOGRAM-userGeneratedNode_1646417604301", name: "HISTOGRAM" },
  { selector: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b", name: "Line" },
  { selector: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce", name: "Bar" },
  { selector: "CONSTANT-91c3bf6b-fbe5-46d7-bdd6-b971b2bc4b9c", name: "25" },
  { selector: "MULTIPLY-4e5b66d6-0a7b-438d-ac65-81179d8c95fc", name: "X" },
  { selector: "CONSTANT-5d32f34c-8b62-44ea-b694-67a009cf02e5", name: "5" },
  { selector: "CONSTANT-0ec34842-0495-4c54-98ca-244fd9e2040a", name: "4" },
];

const ctrlParameters = [
  [
    { title: "SINE_SINE_frequency", value: 11 },
    { title: "SINE_SINE_offset", value: 0 },
    { title: "SINE_SINE_amplitude", value: 1 },
    { title: "SINE_SINE_waveform", value: "sawtooth" },
    { title: "LINSPACE_Linspace_end", value: 16 },
    { title: "LINSPACE_Linspace_step", value: "3001" },
    { title: "LINSPACE_Linspace_start", value: 50 },
    { title: "CONSTANT_10_constant", value: "10" },
  ],
];

describe("User workflow for simple_constant.txt app", () => {
  it("Should load default flow chart", () => {
    cy.visit("/?test_example_app=simple_constant.txt", {
      onBeforeLoad(win: any) {
        win.disableIntercom = true;
      },
    }).wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });
    cy.wait(10000);
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

    cy.get("body").then(($body) => {
      if ($body.find(".ctrl-close-btn").length > 0) {
        cy.get(".ctrl-close-btn").click({ force: true });
      }
    });
    cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

    cy.get("[data-cy=operation-switch]")
      .contains("Edit")
      .click()
      .should("have.css", "color", "rgb(255, 165, 0)");

    Cypress.on("uncaught:exception", (err) => {
      cy.log("error occured: ", err);
      return false;
    });
    //        cy.get("button[id=INPUT_PLACEHOLDER]").click();
    //
    //        cy.get("[data-cy=add-ctrl]").click().get("button").contains("Numeric Input").first().click();
    //        ctrlParameters.forEach((singleIter, index) => {
    //          singleIter.forEach((item) => {
    //            cy.get("[data-cy=ctrls-select]").click();
    //            cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {
    //              cy.contains(`${item.title}`).click({force: true});
    //              if (item.title === "SINE ▶ WAVEFORM") {
    //                return cy
    //                  .get(`input[value="${item.value}"]`)
    //                  .check(item.value.toString());
    //              }
    //              return cy
    //                .get(`input[type=number]`)
    //                .click()
    //                .type(`{selectall}${item.value.toString()}`)
    //            });
    //          });
    //        });
    //
    //        cy.get(".App-status").contains("🐢 awaiting a new job", {
    //          timeout: 60000,
    //        });
    //
    //        cy.get(`[data-cy="debug-btn"]`)
    //          .click();
    //
    //        cy.get(`[data-cy="btn-play"]`).contains("Play").click().wait(5000);
    //
    //        cy.get("[data-testid=result-node]", { timeout: 200000 });
    //
    //        cy.get(`[data-cy="script-btn"]`)
    //              .click();
    //
    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).click().wait(5000);

    cy.get("[data-testid=result-node]", { timeout: 200000 });

    cy.get(`[data-cy="script-btn"]`).click();
    nodes.forEach((node) => {
      cy.get(`[data-id="${node.selector}"]`).click({
        force: true,
        multiple: true,
      });
      matchPlotlyOutput(`${node.selector}`, "plotlyCustomOutput");
      cy.get(".ctrl-close-btn").click({ force: true });
    });
  });
});
