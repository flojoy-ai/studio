/// <reference types="cypress" />

// Test doesn't pass due to needing to unlock the system keyring
// in order to add a new credential. Skipping until we can find a workaround for this.
describe.skip("Verify Env Variable Modal", () => {
  it("env variable modal test", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    cy.get('[data-testid="settings-btn"]').click();

    cy.percySnapshot("dark flow page with setting dropdown");

    cy.get('[data-testid="env-var-modal-button"]').click();

    cy.percySnapshot("dark flow page with env Modal");

    cy.get('[data-testid="env-var-key-input"]').click().type("CypressTest");

    cy.percySnapshot("dark flow page with key input");

    cy.get('[data-testid="env-var-value-input"]').click().type("CypressTest");

    cy.percySnapshot("dark flow page with value input");

    cy.get('[data-testid="env-modal-add-btn"]').click();

    cy.get('[data-testid="credential-name"]').each((container) => {
      if (container.text().includes("CypressTest")) {
        cy.wrap(container).find('[data-testid="password-icon-view"]').click();
        cy.wrap(container).find('[data-testid="env-var-modify-btn"]').click();
        cy.get('[data-testid="env-var-edit-btn"]').click();
        cy.get('[data-tesid="edit-env-input"]').click().type("CypressModify");
        cy.get('[data-testid="env-var-edit-submit"]').click();
        cy.get('[data-testid="env-var-delete-btn"]').click();
        cy.get('[data-testid="env-var-delete-cancel"]').click();
        cy.get('[data-testid="env-var-delete-continue"]').click();
      }
    });

    const textToCopy = "CypressTest=123";
    cy.get('[data-testid="env-var-key-input"]').paste(textToCopy);
  });
});
