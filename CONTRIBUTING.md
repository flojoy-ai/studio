# Contributing guidelines

## How to contribute code
### Pull Request Workflow

**1. New PR** - As a contributor, you submit a New PR on GitHub. Before submitting your PR make sure to test your changes and the system is working. PR body should include description of changes introduced, and the testing steps you have undertaken to test those.

**2. Review** - We inspect
every incoming PR. At this stage we check if the PR is valid and meets certain quality
requirements. - For example: we check if PR has sufficient
description, if applicable unit tests are added, passed CI, no merge-conflics, etc. If the PR passes all the quality checks then reviewer (person familiar with the
code/functionality) reviews the changes. If all looks good, reviewer would approve the PR. Otherwise changes will be requested. - You make the change and
submit for review again. - This cycle repeats itself till the PR gets
approved.

**3. Approved** - Once the PR is approved, We will merge it into `develop` branch, which will eventually end-up in `main` branch.

---

### How to create a custom node
1.  **Node Function** - A python function for the node. Create a new script file and place it in right category folder in `/PYTHON/FUNCTIONS/`  directory. The script file name should be the node name in uppercase.  
    import `@flojoy` decorator and `DataContainer` class from `flojoy` package : 

    ```bash
        from flojoy import flojoy, DataContainer
    ```
    Decorate your function with `@flojoy` like below:
    ```bash
        @flojoy
        def FUNCTION_NAME(v, params):
    ```
    - `v`: This will receive the output of all the incoming nodes and this will be in `list` format.
    - `params:` A node can have some parameters that can change its behavior. These parameters can be modified in CTRL panel. You have to declare them in manifest file (see below). This will be in `dict` format.  

    Your node function should return an object of `DataContainer` class.   
    **DataContainer:**  A python class that can represent different types of data objects such as: `image`, `ordered_pair`, `matrix` etc. Here is an example of how to return `DataContainer` object:    
    ```code
        x = 10
        y = 15
        return DataContainer(type='ordered_pair', x=x, y=y)
        # {'type': 'ordered_pair', 'x': [10], 'y':[15] }
    ```
2.  **Manifest File** - Write a manifest file for the node in yaml format in `/PYTHON/FUNCTIONS/MANIFEST` folder. The name of the file should contain `.manifest.yaml` suffix following the node name. Here is an example of manifest file of `SINE WAVE` node `sine.manifest.yaml`.
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
    **COMMAND:** `COMMAND` is a list of object. Where each object contains:

    `name:` Name of the node.  
    `key:` A string to identify the node uniquely among all nodes.   
    `type:` A sub-category from `COMMAND_MANIFEST.ts` in `src/feature/flow_chart_panel/manifest/COMMAND_MANIFEST.ts`.    
    `parameters:` Parameters which the node expects in it's function's parameter `params`. Ctrl panel uses this manifest to populate UI where users can modify these parameter values. It's an Object, where each key is a parameter name and value is an object of:
    - `type:` Type of parameter value should be se to one of `number`, `string`. If you want to add a new type discuss it with the team.
    - `default:` Default value of the parameter.    
    - `options:` Array of options, each option should be of the same type as declared.
    
 3. **New Category** - If your node belongs to a category which doesn't have a corresponding folder in `PYTHON/FUNCTIONS` directory. 
    - Create a folder with category name in uppercase inside `PYTHON/FUNCTIONS/` directory.
    - Import all files containing that folder in `watch.py` file in `PYTHON/WATCH/watch.py` directory like below:
    ```code
        from FUNCTIONS.CONDITIONALS import *
    ```
    - Register that category under proper parent category in `src/feature/flow_chart_panel/manifest/COMMANT_MANIFEST.ts` file in `section` array variable with category name and key.
    - In `jsonify_funk.py` file located in root directory add category folder name in `dirs` list variable.
 4. **Node Styling** - To be added. 
 ---
 
### How to run automated test in local

Run cypress e2e tests:
```bash
    npm run test
```


