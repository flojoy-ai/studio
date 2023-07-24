/// <reference types="cypress" />

describe("Verify Set API modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("set api key test", () => {
    cy.visit("/").wait(1000);

    // Hover file button
    cy.get('[data-testid="file-btn"]').trigger("mouseover");
    // Click Set API Key option
    cy.get('[data-testid="btn-apikey"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with apikey modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Input for API Key
    cy.get('[data-testid="cloud-api-key-input"]').type("TestAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with cloud api key input",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="cloud-input-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit cloud api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Change to OPENAI tab
    cy.get('[data-testid="openai-tab"]').click();

    // Input for API Key
    cy.get('[data-testid="openai-api-key-input"]').type("OPENAIAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with openai api key input",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="openai-input-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit openai api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Change to S3 tab
    cy.get('[data-testid="s3-tab"]').click();

    // Input for API Key
    cy.get('[data-testid="s3_name_input"]').type("TestAPIKeyInput");
    // Input for API Key
    cy.get('[data-testid="s3_access_input"]').type("TestAPIKeyInput");
    // Input for API Key
    cy.get('[data-testid="s3_secret_input"]').type("TestAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with s3 api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="s3-submit-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit s3 keys",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    cy.get('[data-testid="cloud-tab"]').click();
    cy.get('[data-testid="api-key-close-btn"]').click();

    // Switch to light mode and test the same thing
    cy.get('[data-testid="darkmode-toggle"]').click();

    // Hover file button
    cy.get('[data-testid="file-btn"]').trigger("mouseover");
    // Click Set API Key option
    cy.get('[data-testid="btn-apikey"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page with apikey modal",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Input for API Key
    cy.get('[data-testid="cloud-api-key-input"]').type("TestAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with cloud api key input",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="cloud-input-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit cloud api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Change to OPENAI tab
    cy.get('[data-testid="openai-tab"]').click();

    // Input for API Key
    cy.get('[data-testid="openai-api-key-input"]').type("TestAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with openai api key input",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="openai-input-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit openai api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Change to S3 tab
    cy.get('[data-testid="s3-tab"]').click();

    // Input for API Key
    cy.get('[data-testid="s3_name_input"]').type("TestAPIKeyInput");
    // Input for API Key
    cy.get('[data-testid="s3_access_input"]').type("TestAPIKeyInput");
    // Input for API Key
    cy.get('[data-testid="s3_secret_input"]').type("TestAPIKeyInput");
    cy.eyesCheckWindow({
      tag: "dark flow page with s3 api key",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    // Click submit button
    cy.get('[data-testid="s3-submit-btn"]').click();
    cy.eyesCheckWindow({
      tag: "dark flow page submit s3 keys",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });
    cy.get('[data-testid="cloud-tab"]').click();
    cy.get('[data-testid="api-key-close-btn"]').click();
  });
});
