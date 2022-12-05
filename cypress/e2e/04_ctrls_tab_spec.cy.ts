const ctrlParameters = [
    [
      { title: "Linspace ▶ START", value: 10 },
      { title: "Linspace ▶ END", value: 34 },
      { title: "Linspace ▶ STEP", value: 3000 },
      { title: "SINE ▶ FREQUENCY", value: 85 },
      { title: "SINE ▶ OFFSET", value: 0 },
      { title: "SINE ▶ AMPLITUDE", value: 25 },
      // { title: "SINE ▶ WAVEFORM", value: "sine" },
      { title: "2.0 ▶ CONSTANT", value: 8 },
    ],
    // [
    //   { title: "LINSPACE ▶ START", value: "5" },
    //   { title: "LINSPACE ▶ END", value: "20" },
    //   { title: "LINSPACE ▶ STEP", value: "2" },
    //   { title: "SINE ▶ FREQUENCY", value: "5" },
    //   { title: "SINE ▶ OFFSET", value: "2" },
    //   { title: "SINE ▶ AMPLITUDE", value: "5" },
    //   { title: "SINE ▶ WAVEFORM", value: "square" },
    //   { title: "8 ▶ CONSTANT", value: "5" },
    // ],
  ];

describe('Ctrl Tab management', () => {
    it("Should load default flow chart", () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.visit("/").wait(1000);
        cy.get("[data-testid=react-flow]", { timeout: 20000 });;

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000);
        cy.get(`[data-cy="app-status"]`)
        .find('code')
        .then( ($ele) => {
          if ($ele.text().includes("🐢 awaiting a new job") || 
          $ele.text().includes("⏰ server uptime:")) {
              return true;
          } else {
            throw new Error("not correct status")
          }
        });

    cy.get("body").then($body => {
      if ($body.find(".ctrl-close-btn").length > 0) {   
        cy.get(".ctrl-close-btn").click({ force: true }); 
      }
    });
    cy.get(`[data-cy="ctrls-btn"]`)
      .click({timeout : 10000});

    cy.get("[data-cy=operation-switch]")
      .contains("Edit")
      .click()
      .should("have.css", "color", "rgb(255, 165, 0)");

    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.get("button[id=INPUT_PLACEHOLDER]").click();

    cy.get("[data-cy=add-ctrl]").click().get("button").contains("Numeric Input").first().click();
    ctrlParameters.forEach((singleIter, index) => {
      singleIter.forEach((item) => {
        cy.get("[data-cy=ctrls-select]").click();
        cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {
          cy.contains(`${item.title}`).click({force: true});
          if (item.title === "SINE ▶ WAVEFORM") {
            return cy
              .get(`input[value="${item.value}"]`)
              .check(item.value.toString());
          }
          return cy
            .get(`input[type=number]`)
            .click()
            .type(`{selectall}${item.value.toString()}`)
        });
      });
    });
  });
})