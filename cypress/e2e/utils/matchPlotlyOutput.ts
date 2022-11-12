const matchPlotlyOutput = (selector:string, resultFixture: string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;
        
    }).then(()=>{
        cy.fixture(resultFixture).then(data=>{
            expect(data[selector].data[0].x).to.deep.equal(output[selector].data[0].x)
            if(selector === "SINE-userGeneratedNode_1646417316016"){
                expect(data[selector].data[0].y).to.deep.equal(output[selector].data[0].y)
            }
       
        })
    })
}

export {
    matchPlotlyOutput
}