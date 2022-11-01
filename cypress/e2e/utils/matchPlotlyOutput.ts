// import { expect } from "chai";

const matchPlotlyOutput = (selector:string) => {
    let output:any;
    cy.window().then((win: any)=> {
        output = win.plotlyOutput;
    }).then(()=>{
        cy.fixture('plotlyDefaultOutput').then(data=>{
            // cy.log(' fixure log : ', output[selector], selector)
            // cy.log(' data log : ', data[selector], data)
            expect(data[selector].data[0].x).to.deep.equal(output[selector].data[0].x)
            // if(selector !== 'RAND-userGeneratedNode_1646417371398'){
            //     expect(data[selector].data[0].y).to.deep.equal(output[selector].data[0].y)
            // }
       
        })
    })
}

export {
    matchPlotlyOutput
}