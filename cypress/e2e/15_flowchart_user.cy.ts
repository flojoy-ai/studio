/// <reference types="cypress" />

//** Combined test of flowchart for default app and captures the results as snapshots in light/dark mode.*/

describe("Testing flowchart user with keyboard shortcuts", () => {
  it("flowchart user test on default app", () => {
    cy.visit("/").wait(1000);
    cy.get('[data-testid="close-welcome-modal"]').click();

    cy.get('[data-testid="watch-mode-toggle"]').click();
    //press play shortcut (meta + p)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "p",
      metaKey: true,
    });

    // center screen
    cy.wait(2000).get('[data-testid="react-flow"]').trigger("keydown", {
      key: "1",
      metaKey: true,
    });

    // editing constant node value to test watch mode
    cy.get(
      '[data-testid="rf__node-CONSTANT-07f3a246-5fac-45ef-941f-91e41f8b7e11"]',
    ).click();
    cy.percySnapshot("dark flow page with CONSTANT menu");
    cy.get('[data-testid="float-input"]')
      .eq(0)
      .type("{selectall}{backspace}")
      .type(10);
    //press cancel shortcut (meta + c)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "c",
      metaKey: true,
    });
    //press play shortcut (ctrl + p)
    cy.wait(1000).get('[data-testid="react-flow"]').trigger("keydown", {
      key: "p",
      ctrlKey: true,
    });
    //press selectAll shortcut (meta)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "a",
      metaKey: true,
    });
    cy.percySnapshot("dark flow page with all selected nodes (meta)");
    //press deselectAll shortcut (meta)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "0",
      metaKey: true,
    });
    cy.percySnapshot("dark flow page with no selected nodes (meta)");
    //press deselectAll shortcut (ctrl)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "0",
      ctrlKey: true,
    });
    cy.percySnapshot("dark flow page with no selected nodes (ctrl)");
    //press selectAll shortcut (ctrl)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "a",
      ctrlKey: true,
    });
    cy.percySnapshot("dark flow page with all selected nodes (ctrl)");
    //press deselectNode shortcut (ctrl)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "9",
      ctrlKey: true,
    });
    cy.percySnapshot("dark flow page with one deselect node (ctrl)");
    //press deselectNode shortcut (meta)
    cy.get('[data-testid="react-flow"]').trigger("keydown", {
      key: "9",
      metaKey: true,
    });
    cy.percySnapshot("dark flow page with one deselect node (meta)");
  });
});
