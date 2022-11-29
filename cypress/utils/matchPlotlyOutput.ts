
const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;  
    }).then(()=>{
            if (output === undefined) {
                throw Error("output is undefined");
            } else {
                cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector});
            }
    })
}

export {
    matchPlotlyOutput
}