
const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;  
        console.log("output: ");
        
        console.log(output);
              
    }).then(()=>{
            if (output === undefined) {
                throw new Error("undefined value of output")
            } else {
                cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector});
            }
    })
}

export {
    matchPlotlyOutput
}