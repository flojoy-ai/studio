const ctrlParameters = [
  [
    { title: "Linspace ▶ START", value: 10 },
    { title: "Linspace ▶ END", value: 34 },
    { title: "Linspace ▶ STEP", value: 3000 },
    { title: "SINE ▶ FREQUENCY", value: 85 },
    { title: "SINE ▶ OFFSET", value: 0 },
    { title: "SINE ▶ AMPLITUDE", value: 25 },
    { title: "2.0 ▶ CONSTANT", value: 8 },
  ],
];

describe("Ctrl Tab management", () => {
  it("Should load default flow chart", () => {
    cy.on("uncaught:exception", () => false);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit("/");
    cy.get("[data-testid=react-flow]", { timeout: 20000 });
    cy.get(`[data-cy="app-status"]`)
      .find("code")
      .contains("🐢 awaiting a new job", { timeout: 5000 });

    cy.get("body").then(($body) => {
      if ($body.find(".ctrl-close-btn").length > 0) {
        cy.get(".ctrl-close-btn").click({ force: true });
      }
    });
    cy.get(`[data-cy="ctrls-btn"]`).click({ timeout: 10000 });

    cy.get("[data-cy=operation-switch]")
      .contains("Edit")
      .click()
      .should("have.css", "color", "rgb(255, 165, 0)");

    cy.get("button[id=INPUT_PLACEHOLDER]").click();

    cy.get("[data-cy=add-ctrl]")
      .click()
      .get("button")
      .contains("Numeric Input")
      .first()
      .click();
    ctrlParameters.forEach((singleIter, index) => {
      singleIter.forEach((item) => {
        cy.get("[data-cy=ctrls-select]").click();
        cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {
          cy.contains(`${item.title}`).click({ force: true });
          if (item.title === "SINE ▶ WAVEFORM") {
            return cy
              .get(`input[value="${item.value}"]`)
              .check(item.value.toString());
          }
          return cy
            .get(`input[type=number]`)
            .click()
            .type(`{selectall}${item.value.toString()}`);
        });
      });
    });
  });
});
export {};
