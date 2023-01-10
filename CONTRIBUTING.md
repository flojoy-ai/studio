# Contributing guidelines
## Pull Request Checklist

Before sending your pull requests, make sure you do the following:
-   Read and follow [Custom Node Rules](#custom-node-rules)
-   Read the [Pull Request Workflow](#pull-request-workflow). 
- Run [Automated Cypress E2E test](#running-automated-cypress-e2e-test)

## How to become a contributor and submit your own custom node
### Pull Request Workflow

**1. New PR** - As a contributor, you submit a New PR on GitHub. - We inspect
every incoming PR. At this stage we check if the PR is valid and meets certain quality
requirements. - For example - We check if PR has sufficient
description, if applicable unit tests are added, passed CI etc.

**2. Is Valid?** - If the PR passes all the quality checks then we go ahead and
assign a reviewer. - If the PR didn't meet the validation criteria, we request
for additional changes to be made to PR to pass quality checks and send it back
or on a rare occassion we may reject it.

**3. Review** - For Valid PR, reviewer (person familiar with the
code/functionality) checks if the PR looks good or needs additional changes. -
If all looks good, reviewer would approve the PR. - If a change is needed, the
contributor is requested to make suggested change. - You make the change and
submit for the review again. - This cycle repeats itself till the PR gets
approved.

**4. Approved** - Once the PR is approved, it gets a Tag with v*.. pattern. For example : `v0.1.1` it initiates CD tests. - We can't move forward if test 
fails. - In such situations, we may request you to make further changes to your
PR for the tests to pass. - Once the tests pass, we now bring all the code in
the internal code base.
---
### Custom Node Rules
1.  **Manifest File** - Write a manifest file for the node in yaml format. The name of the file should contain `.manifest.yaml` suffix following by node name in `/PYTHON/FUNCTIONS/MANIFEST` folder. Here is an example of manifest file of `SINE WAVE` node `sine.manifest.yaml`.
    ```yaml
    COMMAND:
      - {
          name: Sine Wave,
          key: SINE,
          type: SIMULATION,
          parameters:
            {
              frequency: { type: float, default: 1 },
              offset: { type: float, default: 0 },
              amplitude: { type: float, default: 1 },
              waveform:
                {
                  type: select,
                  options: [sine, square, triangle, sawtooth],
                  default: sine,
                },
            },
        }
    ```
    **COMMAND:** `COMMAND` is a scalar list of object. Where each object contains:

    `name:` name of the node.  
    `key:` node key.   
    `type:` Type of node.    
    `parameters:` object of node parameters. Where for each key is a parameter name and value is an object of:
    - `type:` type of parameter value.
    - `default:` default value of the parameter.    
    - `options:` Array of options if parameter is of `select` type
    

2.  **Node Function** - A python function for the node. Place the function in right category folder in `/PYTHON/FUNCTIONS/`  directory. File name should be node name in uppercase.  
    In function body import `@flojoy` decorator from `flojoy_python` package :   

    ```bash
        from flojoy import flojoy, DataContainer
    ```
    Use decorator before your function like:
    ```bash
        @flojoy
        def FUNCTION_NAME(v, params):
    ```
    - `v`: Node inputs in `list` format. In other word, output of previous nodes.   
    - `params:` Current node parameters in `dict` format.    
    ***DataContainer:** A python class that returns different type of data objects. A simple use of `DataContainer` is as follows:    
    ```code
        return DataContainer(type='ordered_pair', x=x, y=y)
    ```
    
### Running Automated Cypress E2E Test

With your custom node you can create and test example apps. To do so:
- Create a new flow chart with your node and save it by clicking on `save` on control bar.
- Place your saved example app in `public/example-apps/` directory.
- In `cypress/e2e/example_apps.spec.cy.ts` file add an object in `exampleApp` array as follows:
    - `title`: name of the example app file.

It will automatically generate a test for your example app, which will run on CI. You can test locally and save snapshot by running following script in terminal:
```bash
    npm run test
```


