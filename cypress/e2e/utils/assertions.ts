const matchPlotSnapshot = (selector: string, name: string) => {
  // const nodes = ['linspace','sine','rand','constant','multiply','add','scatter','histogram'];
  // const main_ctrls = ['ctrl-0','ctrl-1'];
  // const nodes_ctrls = ['linspace-ctrl-0','linspace-ctrl-1','sine-ctrl-0','sine-ctrl-1','rand-ctrl-0','rand-ctrl-1',
  //                       'constant-ctrl-0','constant-ctrl-1','multiply-ctrl-0','multiply-ctrl-1','add-ctrl-0','add-ctrl-1','scatter-ctrl-0','scatter-ctrl-1','histogram-ctrl-0','histogram-ctrl-1'];
  // const debug = ['debug','debug-ctrl-0','debug-ctrl-1'];

  // if(nodes.includes(name) || nodes_ctrls.includes(name)){
  //   cy.viewport(878,453);
  // }
  // else if(debug.includes(name)){
  //   cy.viewport(1000,653);
  // }
  // else if(main_ctrls.includes(name)){
  //   cy.viewport(1000,1610);
  // }

  return cy.waitUntil(function() {
    /*
    return cy.get(selector).should('be.visible').matchImageSnapshot(name,{
      allowSizeMismatch: true,
      failureThreshold: 0.3, // threshold for entire image
      failureThresholdType: 'percent', // percent of image or number of pixels
      customDiffConfig: { threshold: 0.3 }, // threshold for each pixel
      capture: 'viewport', // capture viewport in screenshot
    });
  }, { timeout: 50000 });
  */
  return cy.get(selector).should('be.visible').snapshot();
}, { timeout: 50000 });
}

export {
  matchPlotSnapshot
}
