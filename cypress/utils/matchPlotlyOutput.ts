
const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;
    }).then(()=>{
            if (output === undefined) {
                // ToDo need to find out why resultdata is not set in win.plotlyOutput in github action test
                throw Error("output is undefined");
            } else {
                console.log(output)
                cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector});
            }
    })
}

export {
    matchPlotlyOutput
}