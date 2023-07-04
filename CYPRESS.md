# Creating a new test

When we create a new component on our frontend, we must create a cypress test in order to maintain the functionality of the code. There are certain steps that we should follow when we create a test.

We should first distinguish whether or not we are going to use Applitools. Applitools is an application that takes a snapshot of our website to verify if the components are displaying correctly or not.
If you created a component that needs a visual testing, it is probably a good idea to use Applitools. If not, you can only use cypress to test the component’s functionality.

## Connecting Cypress to Applitools

To connect any visual tests results from cypress to applitools:

1. visit applitools
2. click user-info icon on the very top right ⇒ click on “**My API Key”.** The key should be present if you are in the system.
3. Next, within studio repository, search for `applitools.config.js` and paste the key over `APPLITOOLS_API_KEY`.

`Note: DO NOT PUSH applitools.config.js TO DEVELOP/MAIN BRANCH`

Now, you are ready to use applitools in cypress.

## Template - With Applitools

```ts
/// <reference types="cypress" />
describe("[Description of the test]", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];

  // This method performs setup before each test.
  beforeEach(() => {
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    cy.eyesOpen({
      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      appName: "[Name of the repository that you are testing]",

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      testName: Cypress.currentTest.title,
    });
  });

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("[Name of our test file]", () => {
    // Test your component
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
```

## Template - Without Applitools

```ts
/// <reference types="cypress" />

describe("[Description of the test]", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];

  it("[Name of our test file]", () => {
    // Test your component
  });
});
```

If you created a UI component, you must include `data-testid` attribute or `data-cy` attribute to test your component. By including these attributes, you are able to grab your component in cypress and test it such as click, hover, and etc.

## How to use test attributes

- Grab the component that you created and test its behaviour.

```ts
cy.get('[data-testid="new_component"]').click();
```

For more information, visit [here](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) and check our example.

### Example

```ts
/// <reference types="cypress" />

describe("studio", () => {
  const layoutRegions = [
    { selector: '[data-cy="app-status"]' },
    { selector: '[data-cy="btn-play"]' },
  ];

  // This method performs setup before each test.
  beforeEach(() => {
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    cy.eyesOpen({
      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      appName: "studio",

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      testName: Cypress.currentTest.title,
    });
  });

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("clear canvas test", () => {
    cy.visit("/").wait(1000);

    // Clear canvas
    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.eyesCheckWindow({
      tag: "dark flow page without any nodes",
      target: "window",
      layout: layoutRegions,
      fully: true,
    });

    // Verify there aren't any nodes
    cy.get('[data-testid="node-wrapper"]').should("have.length", 0);
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
```

# Writing comments

Make sure to describe your e2e test in 1-2 sentences in `[Description of the test]` and `[Test description]` sections.
