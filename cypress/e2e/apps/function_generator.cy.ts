import { matchPlotSnapshot } from "../utils/assertions";

const nodes = [
  {selector: "LINSPACE-userGeneratedNode_1646432683694", name: 'linspace'},
  {selector: "SINE-userGeneratedNode_1646417316016", name: 'sine'},
  {selector: "RAND-userGeneratedNode_1646417371398", name: 'rand'},
  {selector: "2.0-userGeneratedNode_1646435677928", name: 'constant'},
  {selector: "MULTIPLY-userGeneratedNode_1646417352715", name: 'multiply'},
  {selector: "ADD-userGeneratedNode_1646417428589", name: 'add'},
  {selector: "SCATTER-userGeneratedNode_1646417560399", name: 'scatter'},
  {selector: "HISTOGRAM-userGeneratedNode_1646417604301", name: 'histogram'},
];

describe('Run Default App', ()=> {
  it('visit page', () => {
    cy.visit('/');
  });

  it('Flow chart should be loaded.', () => {
    cy.get('.react-flow');
  });

  it('Should run the app', () => {
    cy.contains('button', 'Play').click();
  });

  it('Should wait for finishing', () => {
    cy.contains('.App-status', '🐢 awaiting a new job', {
      timeout: 20000000
    });
  });

  it('Should click through all the charts and check if charts are there', () => {
    nodes.forEach(node => {
      cy.get(`[data-id="${node.selector}"]`).click({ force: true, multiple: true });
      matchPlotSnapshot(`[id="${node.selector}"]`, node.name);
      cy.get('.ctrl-close-btn').click({ force: true });
    });
  });

  it('Visit to the DEBUG page and match the complete snapshot', () => {
    cy.get('[data-cy=debug-btn]').click();
    matchPlotSnapshot(`main`, 'debug');
  });
})