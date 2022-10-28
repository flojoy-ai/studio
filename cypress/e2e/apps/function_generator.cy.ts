/* eslint-disable cypress/no-unnecessary-waiting */
import { matchPlotSnapshot } from "../utils/assertions";
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

const ctrlParameters = [
  [
    { title: "LINSPACE ▶ START", value: "1" },
    { title: "LINSPACE ▶ END", value: "14" },
    { title: "LINSPACE ▶ STEP", value: "3" },
    { title: "SINE ▶ FREQUENCY", value: "3" },
    { title: "SINE ▶ OFFSET", value: "0" },
    { title: "SINE ▶ AMPLITUDE", value: "1" },
    { title: "SINE ▶ WAVEFORM", value: "sine" },
    { title: "8 ▶ CONSTANT", value: "8" },
  ],
  [
    { title: "LINSPACE ▶ START", value: "5" },
    { title: "LINSPACE ▶ END", value: "20" },
    { title: "LINSPACE ▶ STEP", value: "2" },
    { title: "SINE ▶ FREQUENCY", value: "5" },
    { title: "SINE ▶ OFFSET", value: "2" },
    { title: "SINE ▶ AMPLITUDE", value: "5" },
    { title: "SINE ▶ WAVEFORM", value: "square" },
    { title: "8 ▶ CONSTANT", value: "5" },
  ],
];

describe("Run Default App", () => {
  it("visit page", () => {
    cy.visit("/");
  });

  it("Flow chart should be loaded.", () => {
    cy.get(".react-flow");
  });
  it("Switch to ctrls tab upon clicking on CTRLS.", () => {
    cy.get("button")
      .contains("CTRLS")
      .click()
      .should("have.class", "active-dark");
  });

  it("Should run the app", () => {
    cy.contains(".App-status", "🐢 awaiting a new job", {
      timeout: 20000,
    });
    cy.contains("button", "Play").click().wait(5000);
  });

  it("Should wait for finishing", () => {
    cy.contains(".App-status", "🐢 awaiting a new job", {
      timeout: 20000000,
    });
  });

  it("Should click through all the charts and check if charts are there", () => {
    cy.get('button').contains('SCRIPT').click();
    nodes.forEach((node) => {
      cy.get(`[data-id="${node.selector}"]`).click({
        force: true,
        multiple: true,
      });
      matchPlotlyOutput(node.selector);
      cy.get(".ctrl-close-btn").click({ force: true });
    });
  });

  // it('Visit to the DEBUG page and match the complete snapshot', () => {
  //   cy.get('[data-cy=debug-btn]').click();
  //   matchPlotSnapshot(`main`, 'debug');
  // });

  // it('Visit to the CTRL tab, and for different variations of inputs, test different output on all the DEBUG, SCRIPTS, and CTRL tabs.', () => {
  //   ctrlParameters.forEach((singleIter, index) => {
  //     cy.get('[data-cy=ctrls-btn]').click();
  //     singleIter.forEach((item) => {
  //       cy.contains('[data-cy=ctrl-grid-item]', item.title).within(() => {
  //         if (item.title === 'SINE ▶ WAVEFORM') {
  //           return cy.get(`input[value=${item.value}]`).check(item.value);
  //         }
  //         return cy.get('input[type=number]').focus().type("{selectall}").type(item.value);
  //       });
  //     });
  //     cy.contains('.App-status', '🐢 awaiting a new job', {
  //       timeout: 20000000
  //     });
  //     cy.contains('button', 'Play').click().wait(2000);
  //     cy.contains('.App-status', '🐢 awaiting a new job', {
  //       timeout: 20000000
  //     });
  //     matchPlotSnapshot(`main`, `ctrl-${index}`);
  //     cy.get('[data-cy=script-btn]').click();
  //     nodes.forEach(node => {
  //       cy.get(`[data-id="${node.selector}"]`).click({ force: true, multiple: true });
  //       matchPlotSnapshot(`[data-id="${node.selector}"]`, `${node.name}-ctrl-${index}`);
  //       cy.get('.ctrl-close-btn').click({ force: true });
  //     });
  //     cy.get('[data-cy=debug-btn]').click();
  //     matchPlotSnapshot(`main`, `debug-ctrl-${index}`);
  //   });
  // });
});
