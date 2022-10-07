const matchPlotSnapshot = (selector: string, name: string) => {
  return cy.waitUntil(function() {
    return cy.get(selector).should('be.visible').matchImageSnapshot(name,{
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: 'percent', // percent of image or number of pixels
      customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
      capture: 'viewport', // capture viewport in screenshot
    });
  }, { timeout: 1000 });
}

export {
  matchPlotSnapshot
}
