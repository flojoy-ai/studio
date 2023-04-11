import { NOISY_SINE } from "@src/data/RECIPES";

describe("Saving Default App", () => {
  beforeEach(() => {
    Cypress.on("uncaught:exception", () => false);
    cy.visit("/", {
      onBeforeLoad(win: any) {
        win.disableIntercom = true;
      },
    }).wait(1000);
  });
  it("should click the save button & call showSaveFilePicker", () => {
    cy.window().then((win) =>
      cy.stub(win, "showSaveFilePicker").as("showSaveFilePicker").returns(true)
    );
    cy.get(`[data-cy="dropdown-wrapper"]`)
      .click()
      .get(`[data-cy="btn-save"]`)
      .click();
    cy.get("@showSaveFilePicker")
      .should("have.been.calledOnce")
      .invoke("restore");
  });
  it("should write the default app and check if the file content matches the written object", () => {
    const fileName = "cypress/downloads/test.txt";
    cy.get(`[data-cy="dropdown-wrapper"]`)
      .click()
      .get(`[data-cy="btn-save"]`)
      .click()
      .writeFile(fileName, JSON.stringify(NOISY_SINE));
    cy.readFile(fileName).then((text) => {
      expect(text).to.equal(JSON.stringify(NOISY_SINE)); // true
    });
  });
});
