describe('Run Default App', ()=> {
  it('visit page', () => {
    cy.visit('/')
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
    cy.get('[data-id=LINSPACE-userGeneratedNode_1646432683694]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=SINE-userGeneratedNode_1646417316016]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=RAND-userGeneratedNode_1646417371398]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id="2.0-userGeneratedNode_1646435677928"]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=MULTIPLY-userGeneratedNode_1646417352715]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=ADD-userGeneratedNode_1646417428589]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=SCATTER-userGeneratedNode_1646417560399]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });

    cy.get('[data-id=HISTOGRAM-userGeneratedNode_1646417604301]').click({ force: true, multiple: true });
    cy.waitUntil(function() {
      return cy.get('.plot-container').should('be.visible');
    });
    cy.get('.ctrl-close-btn').click({ force: true });
  });
})