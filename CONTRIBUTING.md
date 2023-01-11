# Contributing guidelines

## How to contribute code
### Pull Request Workflow

**1. New PR** - As a contributor, you submit a New PR on GitHub. Before submitting your PR make sure that code is working and system is working as well, also write description in PR body with Testing steps you take to test changes - We inspect
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
fails. - In such situations, we may request you to make further changes to your PR for the tests to pass. - Once the tests pass, we now bring all the code in the internal code base.

---

### Custom Node Rules
1.  **Node Function** - A python function for the node. Create a new script file and place it in right category folder in `/PYTHON/FUNCTIONS/`  directory. The script file name should be the node name in uppercase.  
    import `@flojoy` decorator `DataContainer` class from `flojoy` package : 

    ```bash
        from flojoy import flojoy, DataContainer
    ```
    Decorate your function with `@flojoy` like below:
    ```bash
        @flojoy
        def FUNCTION_NAME(v, params):
    ```
    - `v`: This will receive the output of all the incoming nodes and this will be in `list` format.
    - `params:` A node can have some parameters that can change its behavior. This parameters can be modified in CTRL panel. You have to declare then in manifest file. This will be in `dict` format.  

    Your node function should return an object of `DataContainer` class.   
    **DataContainer:**  A python class that can represent different type of data objects such as - `image`, `ordered_pair`, `matrix` etc. Here is an example of how to return `DataContainer` object:    
    ```code
        x = 10
        y = 15
        return DataContainer(type='ordered_pair', x=x, y=y)
        # {'type': 'ordered_pair', 'x': [10], 'y':[15] }
    ```
2.  **Manifest File** - Write a manifest file for the node in yaml format in `/PYTHON/FUNCTIONS/MANIFEST` folder. The name of the file should contain `.manifest.yaml` suffix following by node name. Here is an example of manifest file of `SINE WAVE` node `sine.manifest.yaml`.
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

    `name:` Name of the node.  
    `key:` A string to identify the node which should be unique among other nodes.   
    `type:` A sub-category from `COMMAND_MANIFEST.ts` in `src/feature/flow_chart_panel/manifest/COMMAND_MANIFEST.ts`.    
    `parameters:` Parameters which node expects in it's function's parameter `params`. In ctrl panel to let users modify the parameters this manifest is used. It's an Object. Where for each key is a parameter name and value is an object of:
    - `type:` Type of parameter value.
    - `default:` Default value of the parameter.    
    - `options:` Array of options if parameter is of `select` type
    
 3. **New Category** - If your node belongs to a category which doesn't have a corresponding folder in `PYTHON/FUNCTIONS` directory. 
    - Create a folder with category name in uppercase inside `PYTHON/FUNCTIONS/` directory.
    - Register that category under proper parent category in `src/feature/flow_chart_panel/manifest/COMMANT_MANIFEST.ts` file in `section` array variable with category name and key.
    - In `jsonify_funk.py` file located in root directory add category folder name in `dirs` list variable.
 
 ---
 
### Running Automated Cypress E2E Test

Run:
```bash
    npm run test
```


