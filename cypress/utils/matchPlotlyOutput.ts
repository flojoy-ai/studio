
const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;  
    }).then(()=>{
            if (output === undefined) {
                    cy.get(".ctrl-close-btn").click({ force: true });
                    // eslint-disable-next-line cypress/no-unnecessary-waiting
                    cy.get("button").contains("Play").click().wait(5000);
                    cy.get("[data-testid=result-node]", { timeout: 200000 });
                    cy.get(`[data-id="${selector}"]`).click({
                        force: true,
                        multiple: true,
                      });
                    cy.window().then((win: any)=> {
                        output = win.plotlyOutput;  
                    })
                    cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector});
            } else {
                cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector});
            }
    })
}

export {
    matchPlotlyOutput
}