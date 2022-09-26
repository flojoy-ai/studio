const matchPlotSnapshot = (selector: string, name: string) => {
  return cy.waitUntil(function() {
    return cy.get(selector).should('be.visible').matchImageSnapshot(name);
  }, { timeout: 1000 });
}

export {
  matchPlotSnapshot
}
