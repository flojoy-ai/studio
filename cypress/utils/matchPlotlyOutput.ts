const matchPlotlyOutput = (selector?: string, resultFixture?: string) => {
  let output: any;
  cy.window()
    .then((win: any) => {
      output = win.plotlyOutput;
    })
    .then(() => {
      if (!selector) {
        cy.wrap(output).snapshot({ name: "results" });
      } else {
        cy.wrap(output[selector].data[0]).snapshot({
          name: resultFixture + "_" + selector,
        });
      }
    });
};

export { matchPlotlyOutput };
