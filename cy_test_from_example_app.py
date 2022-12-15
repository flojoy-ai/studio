import os
import json


def get_selector_and_name(element: dict):
    if 'source' not in element:
        return {
            'selector': element['id'],
            'name': element['data']['label']
        }


def ctrl_manifest_map(ctrl: dict):
    if ctrl['type'] == 'input':
        return {
            'title': ctrl['param']['id'],
            'value': ctrl['val']
        }


def filter_null_values(element: dict):
    if element is not None:
        return element


def write_cypress_tests():
    # Get a list of all text files in the public folder
    text_files = [f for f in os.listdir(
        'public/example-apps') if f.endswith('.txt')]

    for file_name in text_files:
        with open('public/example-apps/{}'.format(file_name), 'r') as file:
            contents = file.read()
            jsonify = json.loads(contents)
            elements: list = jsonify['rfInstance']['elements']
            map_elements = list(map(get_selector_and_name, elements))
            filter_elements = list(filter(filter_null_values, map_elements))
            ctrls_manifest: list = jsonify['ctrlsManifest']
            map_ctrls_manifest = list(map(ctrl_manifest_map, ctrls_manifest))
            filter_ctrls_manifest = list(filter(
                filter_null_values, map_ctrls_manifest))

        test_string = """
import {{ matchPlotlyOutput }} from 'cypress/utils/matchPlotlyOutput';
const nodes={}

const ctrlParameters={}

describe('User workflow for {} app', ()=> {{
    it("Should load default flow chart", () => {{
        cy.visit("/?test_example_app={}", {{
            onBeforeLoad (win:any) {{
                win.disableIntercom = true;
                }}}}).wait(1000);
        cy.get("[data-testid=react-flow]", {{ timeout: 20000 }});
        cy.wait(10000);
        cy.get(`[data-cy="app-status"]`)
        .find('code')
        .then( ($ele) => {{
          if ($ele.text().includes("🐢 awaiting a new job") || 
          $ele.text().includes("⏰ server uptime:")) {{
              return true;
          }} else {{
            throw new Error("not correct status")
          }}
        }});

        cy.get("body").then($body => {{
          if ($body.find(".ctrl-close-btn").length > 0) {{   
            cy.get(".ctrl-close-btn").click({{ force: true }}); 
          }}
        }});
        cy.get(`[data-cy="ctrls-btn"]`)
          .click({{timeout : 10000}});

        cy.get("[data-cy=operation-switch]")
          .contains("Edit")
          .click()
          .should("have.css", "color", "rgb(255, 165, 0)");

        Cypress.on("uncaught:exception", (err) => {{
          cy.log('error occured: ', err)
          return false;
        }});
//        cy.get("button[id=INPUT_PLACEHOLDER]").click();
//
//        cy.get("[data-cy=add-ctrl]").click().get("button").contains("Numeric Input").first().click();
//        ctrlParameters.forEach((singleIter, index) => {{
//          singleIter.forEach((item) => {{
//            cy.get("[data-cy=ctrls-select]").click();
//            cy.contains("[data-cy=ctrl-grid-item]", item.title).within(($ele) => {{
//              cy.contains(`${{item.title}}`).click({{force: true}});
//              if (item.title === "SINE ▶ WAVEFORM") {{
//                return cy
//                  .get(`input[value="${{item.value}}"]`)
//                  .check(item.value.toString());
//              }}
//              return cy
//                .get(`input[type=number]`)
//                .click()
//                .type(`{{selectall}}${{item.value.toString()}}`)
//            }});
//          }});
//        }});
//
//        cy.get(".App-status").contains("🐢 awaiting a new job", {{
//          timeout: 60000,
//        }});
//
//        cy.get(`[data-cy="debug-btn"]`)
//          .click();
//
//        cy.get(`[data-cy="btn-play"]`).contains("Play").click().wait(5000);
//
//        cy.get("[data-testid=result-node]", {{ timeout: 200000 }});
//
//        cy.get(`[data-cy="script-btn"]`)
//              .click();
//
        cy.get(`[data-cy="debug-btn"]`)
          .click();
      
        cy.get(`[data-cy="btn-play"]`).click().wait(5000);
      
        cy.get("[data-testid=result-node]", {{ timeout: 200000 }});
      
        cy.get(`[data-cy="script-btn"]`)
          .click();
        nodes.forEach((node) => {{
          cy.get(`[data-id="${{node.selector}}"]`).click({{
            force: true,
            multiple: true,
          }});
          matchPlotlyOutput(`${{node.selector}}`, "plotlyCustomOutput");
          cy.get(".ctrl-close-btn").click({{ force: true }});
          }});

  }});
}})

        """.format(filter_elements, [filter_ctrls_manifest], file_name, file_name)

        with open('cypress/e2e/{}.spec.cy.ts'.format(file_name), 'w') as test_file:
            test_file.write(test_string)


write_cypress_tests()
