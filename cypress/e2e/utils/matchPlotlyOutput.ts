
const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;        
    }).then(()=>{
        // cy.fixture(resultFixture).then(expectedData=>{
            // expect(output[selector].data[0].x).to.deep.equal(expectedData[selector].data[0].x)
            if (output === undefined) {
                throw new Error("undefined value of output")
            } else {
                cy.wrap(output[selector].data[0]).snapshot({ name: resultFixture + '_' + selector })
            }
            // expect(output[selector].data[0].y).to.deep.equal(expectedData[selector].data[0].y)
        // })
    })
}

export {
    matchPlotlyOutput
}