/// <reference types="cypress" />

import { text } from "stream/consumers";

describe("Verify Env Variable Modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("env variable modal test", () => {
    cy.visit("/").wait(1000);

    // Clear canvas
    cy.get('[data-testid="settings-btn"]').click();

    cy.percySnapshot("dark flow page with setting dropdown");

    cy.get('[data-testid="envVariablesModalBtn"]').click();

    cy.percySnapshot("dark flow page with env Modal");

    cy.get('[data-testid="EnvVarKeyInput"]').click().type("CypressTest");

    cy.percySnapshot("dark flow page with key input");

    cy.get('[data-testid="EnvVarValueInput"]').click().type("CypressTest");

    cy.percySnapshot("dark flow page with value input");

    cy.get('[data-testid="envModalAddBtn"]').click();

    cy.get('[data-testid="credentialName"]').each((container) => {
        if (container.text().includes("CypressTest")) {
          cy.wrap(container).find('[data-testid="passWordIconView"]').click();
          cy.wrap(container).find('[data-testid="envVarModifyBtn"]').click();
          cy.get('[data-testid="envVarEditBtn"]').click();
          cy.get('[data-tesid="editEnvInput"]').click().type("CypressModify");
          cy.get('[data-testid="envVarEditSubmit"]').click();
          cy.get('[data-testid="envVarDeleteBtn"]').click();
          cy.get('[data-testid="envVarDeleteCancel"]').click();
          cy.get('[data-testid="envVarDeleteContinue"]').click();
        }
      });

    const textToCopy = "CypressTest=123";
    // cy.get('[data-testid="EnvVarKeyInput"]').invoke("val", textToCopy);
    cy.get('[data-testid="EnvVarKeyInput"]').paste(textToCopy);

    // cy.get('[data-testid="passWordIconView"]').click({multiple:true});
  });
});
